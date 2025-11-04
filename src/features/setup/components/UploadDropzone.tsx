/**
 * UploadDropzone - Drag & drop file upload area
 * Handles file selection, validation, and visual feedback
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { feedback } from '@/lib/feedback';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const baseBoxStyles = "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-muted/20 to-muted/40 p-12 sm:p-14";

export function UploadDropzone({ onFilesSelected, disabled = false }: UploadDropzoneProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: File[]) => {
    const validFiles = files
      .filter(f => f.type.startsWith('image/') || f.name.toLowerCase().endsWith('.heic'))
      .slice(0, 3);

    if (validFiles.length === 0) {
      toast({
        title: t('setup.scanPortal.invalidFiles', 'Invalid files'),
        description: t('setup.scanPortal.invalidFilesDesc', 'Please upload image files (JPG, PNG, HEIC)'),
        variant: 'destructive',
      });
      return;
    }

    feedback.success();
    onFilesSelected(validFiles);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Privacy Badge */}
      <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full bg-background px-4 py-1.5 shadow-sm ring-1 ring-border">
          <Shield className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            {t('setup.scanPortal.privacyProtected', 'Privacy Protected')}
          </span>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload receipt images"
        disabled={disabled}
      />

      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          baseBoxStyles,
          "cursor-pointer transition-all duration-300",
          "hover:border-primary/50 hover:from-muted/30 hover:to-muted/50 hover:shadow-lg hover:shadow-primary/5",
          isDragging && [
            "scale-[1.02] border-primary bg-primary/5",
            "shadow-2xl shadow-primary/10",
            "ring-4 ring-primary/10"
          ],
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={disabled ? undefined : handleBrowseClick}
      >
        <motion.div
          animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Upload className={cn(
            "mb-6 h-16 w-16 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
        </motion.div>
        
        <p className="mb-2 text-center text-lg font-medium">
          {isDragging 
            ? t('setup.scanPortal.dropHere', 'Drop receipts here')
            : t('setup.scanPortal.dropzone', 'Drop receipt images here')
          }
        </p>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          {t('setup.scanPortal.dropzoneHint', 'or click to browse (JPG, PNG, HEIC)')}
        </p>
        
        <Button 
          size="lg" 
          className="pointer-events-none h-14 px-10 text-base font-semibold shadow-lg"
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
        >
          <Upload className="mr-3 h-6 w-6" />
          {t('setup.scanPortal.scanButton', 'Scan or Upload Receipts')}
        </Button>
      </motion.div>
    </div>
  );
}
