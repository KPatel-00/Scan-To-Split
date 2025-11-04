/**
 * useFilePreview - File state management hook
 * Handles file selection, previews, validation, and cleanup
 */

import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/useStore';

interface UseFilePreviewReturn {
  selectedFiles: File[];
  filePreviews: string[];
  isProcessing: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFilesSelected: (files: File[]) => void;
  handleRemoveFile: (index: number) => void;
  triggerFileInput: () => void;
  handleStartScanning: (onFileUpload: (files: FileList | null) => void) => Promise<void>;
}

export function useFilePreview(): UseFilePreviewReturn {
  const { t } = useTranslation();
  const { toast } = useToast();
  const setIsDemoData = useStore((state) => state.setIsDemoData);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup: Revoke object URLs when component unmounts or files change
  useEffect(() => {
    return () => {
      filePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const handleFilesSelected = (files: File[]) => {
    const validFiles = files.slice(0, 3); // Max 3 receipts

    // Merge with existing files (for "Add More" functionality)
    const combinedFiles = [...selectedFiles, ...validFiles];
    const limitedFiles = combinedFiles.slice(0, 3); // Enforce max 3 receipts

    if (combinedFiles.length > 3) {
      toast({
        title: t('setup.scanPortal.tooManyFiles', 'Too many files'),
        description: t('setup.scanPortal.tooManyFilesDesc', 'Maximum 3 receipts allowed. First 3 selected.'),
      });
    }

    // Mark as real user data (will show "continue" banner)
    setIsDemoData(false);

    // Create object URLs for NEW files only (preserve existing previews)
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => [...prev, ...newPreviews].slice(0, 3));
    setSelectedFiles(limitedFiles);
  };

  const handleRemoveFile = (index: number) => {
    // Revoke the URL for the removed file
    URL.revokeObjectURL(filePreviews[index]);
    
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setFilePreviews(previews => previews.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleStartScanning = async (onFileUpload: (files: FileList | null) => void) => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    // Convert File[] to FileList (create a mock FileList)
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));
    
    await onFileUpload(dataTransfer.files);
    
    // Cleanup and reset state
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setFilePreviews([]);
    setIsProcessing(false);
  };

  return {
    selectedFiles,
    filePreviews,
    isProcessing,
    fileInputRef,
    handleFilesSelected,
    handleRemoveFile,
    triggerFileInput,
    handleStartScanning,
  };
}
