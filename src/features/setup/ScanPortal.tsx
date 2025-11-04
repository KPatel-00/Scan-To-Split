/**
 * ScanPortal - Hero-style Receipt Upload Section
 * Inspired by Gemini's "Portal" design - clean, focused data entry
 * 
 * Features:
 * - Prominent upload dropzone
 * - Manual entry alternative
 * - Demo bill quick action
 * - Privacy badge
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Upload, Sparkles, Shield, Plus, FileText, X, Loader2, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { AddItemDialog } from '../../components/AddItemDialog';
import { useStore } from '../../store/useStore';
import { useToast } from '../../hooks/useToast';
import { feedback } from '../../lib/feedback';
import { getDefaultCategory } from '../../lib/taxonomy';
import { typography } from '../../lib/typography';
import { gentleNormal } from '@/lib/motion/physics';
import { cn } from '../../lib/utils';

interface ScanPortalProps {
  onFileUpload: (files: FileList | null) => void;
  managementMode: 'merged' | 'separate';
  hasExistingData?: boolean;
  onContinueEditing?: () => void;
}

export function ScanPortal({ 
  onFileUpload, 
  managementMode,
  hasExistingData = false,
  onContinueEditing,
}: ScanPortalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const items = useStore((state) => state.items);
  const participants = useStore((state) => state.participants);
  const receipts = useStore((state) => state.receipts);
  const isDemoData = useStore((state) => state.isDemoData);
  const addItem = useStore((state) => state.addItem);
  const addParticipant = useStore((state) => state.addParticipant);
  const setMergedBillInfo = useStore((state) => state.setMergedBillInfo);
  const clearSession = useStore((state) => state.clearSession);
  const setIsDemoData = useStore((state) => state.setIsDemoData);

  // ✨ NEW: File preview state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'manual'>('upload'); // ✨ NEW: Toggle mode
  const [manualText, setManualText] = useState(''); // ✨ NEW: Manual entry text
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasData = items.length > 0;

  // ✨ Cleanup: Revoke object URLs when files change
  useEffect(() => {
    return () => {
      filePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  // ✨ NEW: File handling functions
  const handleFilesSelected = (files: File[]) => {
    const validFiles = files
      .filter(f => f.type.startsWith('image/') || f.name.toLowerCase().endsWith('.heic'))
      .slice(0, 3); // Max 3 receipts

    if (validFiles.length === 0) {
      toast({
        title: t('setup.scanPortal.invalidFiles', 'Invalid files'),
        description: t('setup.scanPortal.invalidFilesDesc', 'Please upload image files (JPG, PNG, HEIC)'),
        variant: 'destructive',
      });
      return;
    }

    // ✨ CRITICAL: Merge with existing files (for "Add More" functionality)
    const combinedFiles = [...selectedFiles, ...validFiles];
    const limitedFiles = combinedFiles.slice(0, 3); // Enforce max 3 receipts

    if (combinedFiles.length > 3) {
      toast({
        title: t('setup.scanPortal.tooManyFiles', 'Too many files'),
        description: t('setup.scanPortal.tooManyFilesDesc', 'Maximum 3 receipts allowed. First 3 selected.'),
      });
    }

    // ✨ CRITICAL: Mark as real user data (will show "continue" banner)
    setIsDemoData(false);

    // ✨ Create object URLs for NEW files only (preserve existing previews)
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(prev => [...prev, ...newPreviews].slice(0, 3));
    setSelectedFiles(limitedFiles);
    feedback.success();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files));
      // Clear the input so the same file can be selected again
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

  const handleRemoveFile = (index: number) => {
    feedback.click();
    
    // Revoke the URL for the removed file
    URL.revokeObjectURL(filePreviews[index]);
    
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    setFilePreviews(previews => previews.filter((_, i) => i !== index));
  };

  const handleStartScanning = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    feedback.click();
    
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

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  // ✨ Shared styles for both upload and manual mode boxes
  const baseBoxStyles = "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-gradient-to-br from-muted/20 to-muted/40 p-12 sm:p-14";

  const handleTryDemo = () => {
    feedback.click();
    
    // ✨ CRITICAL: Mark as demo data BEFORE clearing (so it persists)
    setIsDemoData(true);
    
    clearSession();
    
    addParticipant('Lukas');
    addParticipant('Sophie');
    addParticipant('Finn');
    
    setMergedBillInfo('ALDI SÜD', '2025-10-21');
    
    const demoItems = [
      { name: 'Bio Milch 1L', quantity: 1, price: 1.19, category: getDefaultCategory() },
      { name: 'Vollkornbrot', quantity: 1, price: 1.79, category: getDefaultCategory() },
      { name: 'Salatcup "Asia"', quantity: 1, price: 2.49, category: getDefaultCategory() },
      { name: 'Küchentücher x4', quantity: 1, price: 2.29, category: getDefaultCategory() },
      { name: 'Spülmittel', quantity: 1, price: 0.95, category: getDefaultCategory() },
      { name: 'Pfand Leergut', quantity: 1, price: -0.75, category: getDefaultCategory() },
    ];
    
    demoItems.forEach((item) => addItem(item));
    
    feedback.success();
    toast({
      title: t('messages.demoLoaded', 'Demo bill loaded!'),
      description: t('messages.demoLoadedDesc', 'Explore the features with sample data.'),
    });

    // ✨ NEW: Navigate to DataHub after loading demo
    if (onContinueEditing) {
      // Small delay to let Zustand state update
      setTimeout(() => {
        onContinueEditing();
      }, 100);
    }
  };

  const handleManualEntryClick = () => {
    feedback.click();
    setInputMode(inputMode === 'upload' ? 'manual' : 'upload');
  };

  // Stagger animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const gentleLand = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...gentleNormal,
      },
    },
  };

  return (
    <motion.div
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8"
      style={{ minHeight: hasData ? 'auto' : 'calc(100vh - 280px)' }}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Returning User: Show compact banner + upload (don't force Welcome back) */}
      {hasExistingData && !isDemoData && onContinueEditing && (
        <motion.div 
          variants={gentleLand} 
          className="mb-8 rounded-lg border-2 border-primary/20 bg-primary/5 p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Data Summary */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t('setup.scanPortal.continueFrom', 'Continue where you left off')}
              </p>
              <p className="text-base font-semibold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
                {participants.length > 0 && (
                  <> • {participants.length} {participants.length === 1 ? 'participant' : 'participants'}</>
                )}
                {managementMode === 'separate' && receipts.length > 0 && (
                  <> • {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'}</>
                )}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  if (confirm(t('setup.scanPortal.confirmClear', 'This will clear all your current data. Continue?'))) {
                    feedback.click();
                    setIsDemoData(false); // ✨ Reset demo flag when manually clearing
                    clearSession();
                    toast({
                      title: t('setup.scanPortal.sessionCleared', 'Session cleared'),
                      description: t('setup.scanPortal.sessionClearedDesc', 'Ready for a new bill'),
                    });
                  }
                }}
              >
                <X className="h-4 w-4" />
                {t('setup.scanPortal.clear', 'Clear')}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={() => {
                  feedback.click();
                  onContinueEditing();
                }}
              >
                <FileText className="h-4 w-4" />
                {t('setup.scanPortal.continue', 'Continue')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Standard Hero - Always Visible */}
      <motion.div
        className="mb-12 space-y-4 text-center"
        variants={gentleLand}
      >
        <h1 className={typography.display.md}>
          {t('setup.scanPortal.title', "Let's get this sorted.")}
        </h1>
        <p className={typography.body.lgMuted}>
          {t('setup.scanPortal.subtitle', 'Scan or upload up to 3 receipts to begin. The AI will do the heavy lifting.')}
        </p>
      </motion.div>

      {/* Main Upload Area */}
      <motion.div
        variants={gentleLand}
        className="relative"
      >
        {/* Privacy Badge */}
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-background px-4 py-1.5 shadow-sm ring-1 ring-border">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              {t('setup.scanPortal.privacyProtected', 'Privacy Protected')}
            </span>
          </div>
        </div>

        {/* Hidden File Input - Always in DOM so "Add More" button works */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload receipt images"
        />

        {/* Upload Dropzone with File Preview OR Manual Text Entry */}
        {selectedFiles.length === 0 ? (
          <AnimatePresence mode="wait">
            {inputMode === 'upload' ? (
              /* Upload Mode - Dropzone */
              <motion.div
                key="upload-mode"
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
                  
                  // Hover state
                  "hover:border-primary/50 hover:from-muted/30 hover:to-muted/50 hover:shadow-lg hover:shadow-primary/5",
                  
                  // Dragging state
                  isDragging && [
                    "scale-[1.02] border-primary bg-primary/5",
                    "shadow-2xl shadow-primary/10",
                    "ring-4 ring-primary/10"
                  ]
                )}
                onClick={handleBrowseClick}
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
                >
                  <Upload className="mr-3 h-6 w-6" />
                  {t('setup.scanPortal.scanButton', 'Scan or Upload Receipts')}
                </Button>
              </motion.div>
            ) : (
              /* Manual Mode - Text Input */
              <motion.div
                key="manual-mode"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={baseBoxStyles}
              >
                {/* Info Icon with Tooltip - Top Right */}
                <div className="absolute top-4 right-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <p className="font-semibold mb-2">Supported Formats:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Item Name 3.45 or €3.45 Item Name</li>
                          <li>• Quantities: x2, 2x, (2x), ×2, or 3 * 1.29</li>
                          <li>• Decimals: 3.45 or 3,45</li>
                          <li>• Refunds: Pfand -1.25 (negative amounts)</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Centered Text Input - Compact */}
                <div className="w-full max-w-3xl space-y-4">
                  <Textarea
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    placeholder="Paste your receipt here...\n\nVitaminwasser 500ml 3.45\nMilk 1L x2 1.20\nBread 0.89\nCoupon -2.00"
                    className="h-[160px] font-mono text-sm resize-none bg-background/50"
                  />

                  <Button
                    size="lg"
                    onClick={() => {
                      // TODO: Parse manual text and add items
                      feedback.success();
                      toast({
                        title: 'Parsing receipt...',
                        description: 'Manual parsing coming soon!',
                      });
                    }}
                    disabled={!manualText.trim()}
                    className="w-full h-14 gap-2 text-base font-semibold shadow-lg pointer-events-auto"
                  >
                    <Sparkles className="h-6 w-6" />
                    Parse Receipt
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          /* File Preview State */
          <div className="space-y-4 rounded-xl border-2 border-primary/70 bg-primary/5 p-6">
            {/* File Preview Cards */}
            <AnimatePresence mode="popLayout">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex items-center gap-4 rounded-lg border border-border bg-background p-4 shadow-sm"
                >
                  {/* Image Thumbnail */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                    <img
                      src={filePreviews[index]}
                      alt={file.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || 'Image'}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Summary & Actions */}
            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {selectedFiles.length} receipt{selectedFiles.length !== 1 ? 's' : ''} ready • Total {formatFileSize(totalSize)}
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
                  disabled={selectedFiles.length >= 3}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {selectedFiles.length >= 3 ? 'Max 3 receipts' : 'Add More'}
                </Button>

                <Button
                  size="lg"
                  onClick={handleStartScanning}
                  disabled={isProcessing || selectedFiles.length === 0}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Start Scanning
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Alternative Actions - Always visible */}
      <motion.div
        variants={gentleLand}
        className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
      >
        <Button
          variant="link"
          className="gap-2 text-muted-foreground"
          onClick={handleManualEntryClick}
          disabled={managementMode === 'separate'}
        >
          {inputMode === 'upload' ? (
            <>
              <Plus className="h-4 w-4" />
              {t('setup.scanPortal.manualEntry', 'Add items manually')}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {t('setup.scanPortal.wantUpload', 'Want to Upload?')}
            </>
          )}
        </Button>

        <Button
          variant="link"
          className="gap-2 text-primary"
          onClick={handleTryDemo}
        >
          <Sparkles className="h-4 w-4" />
          {t('setup.scanPortal.tryDemo', 'Try our Demo Bill')}
        </Button>
      </motion.div>

      {/* Feature Hints (only show when no data) */}
      {!hasData && (
        <motion.div
          variants={gentleLand}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-sm font-semibold">AI-Powered</h3>
            <p className="text-xs text-muted-foreground">
              Automatic item extraction from receipts
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-sm font-semibold">Privacy First</h3>
            <p className="text-xs text-muted-foreground">
              Sensitive data detected and masked automatically
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-sm font-semibold">Multi-Receipt</h3>
            <p className="text-xs text-muted-foreground">
              Scan up to 3 receipts at once
            </p>
          </div>
        </motion.div>
      )}

      {/* Add Item Dialog */}
      <AddItemDialog
        open={isAddItemDialogOpen}
        onClose={() => setIsAddItemDialogOpen(false)}
      />
    </motion.div>
  );
}
