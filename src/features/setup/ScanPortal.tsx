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

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AddItemDialog } from '../../components/AddItemDialog';
import { useStore } from '../../store/useStore';
import { feedback } from '../../lib/feedback';
import { useToast } from '@/hooks/useToast';
import { typography } from '../../lib/typography';
import { staggerContainer, fadeInUp } from '@/lib/motion';

// ✨ Extracted components
import { FeatureHighlights } from './components/FeatureHighlights';
import { ReturningUserBanner } from './components/ReturningUserBanner';
import { AlternativeActions } from './components/AlternativeActions';
import { UploadDropzone } from './components/UploadDropzone';
import { FilePreviewList } from './components/FilePreviewList';
import { ManualEntryBox } from './components/ManualEntryBox';
import { AIScanAnimation } from './AIScanAnimation';

// ✨ NEW: Business logic hooks
import { useFilePreview } from './hooks/useFilePreview';
import { useDemoData } from './hooks/useDemoData';

interface ScanPortalProps {
  onFileUpload: (files: FileList | null) => void;
  managementMode: 'merged' | 'separate';
  hasExistingData?: boolean;
  onContinueEditing?: () => void;
  isScanning?: boolean;
  scanFileCount?: number;
  onScanComplete?: () => void;
}

export function ScanPortal({
  onFileUpload,
  managementMode,
  hasExistingData = false,
  onContinueEditing,
  isScanning = false,
  scanFileCount = 0,
  onScanComplete,
}: ScanPortalProps) {
  const { t } = useTranslation();
  const items = useStore((state) => state.items);
  const participants = useStore((state) => state.participants);
  const receipts = useStore((state) => state.receipts);
  const isDemoData = useStore((state) => state.isDemoData);
  const setIsDemoData = useStore((state) => state.setIsDemoData);
  const clearSession = useStore((state) => state.clearSession);

  // ✨ NEW: Use custom hooks for business logic
  const {
    selectedFiles,
    filePreviews,
    isProcessing,
    fileInputRef,
    handleFilesSelected,
    handleRemoveFile,
    triggerFileInput,
    handleStartScanning,
  } = useFilePreview();

  const { loadDemoData } = useDemoData();

  // UI state
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'manual'>('upload');
  const [manualText, setManualText] = useState('');

  // ✨ FIX: Combine prop and local state for reliable hasData check
  // This prevents feature icons from disappearing when navigating back
  const hasData = hasExistingData || items.length > 0 || participants.length > 0 || receipts.length > 0;

  const handleManualEntryClick = () => {
    feedback.click();
    setInputMode(inputMode === 'upload' ? 'manual' : 'upload');
  };

  const handleTryDemo = () => {
    loadDemoData(onContinueEditing);
  };

  // ✨ NEW: Read error state from store
  const scanError = useStore((state) => state.scanError);
  const setScanError = useStore((state) => state.setScanError);
  const stopScanning = useStore((state) => state.stopScanning);
  const { toast } = useToast();

  const handleScanError = () => {
    if (scanError) {
      feedback.error();
      toast({
        title: t('messages.scanError', 'Scan Failed'),
        description: scanError,
        variant: 'destructive',
        duration: 5000,
      });
      setScanError(null); // Clear error
      stopScanning(); // Return to upload mode
    }
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
        <ReturningUserBanner
          itemCount={items.length}
          participantCount={participants.length}
          receiptCount={receipts.length}
          managementMode={managementMode}
          isDemoData={isDemoData}
          onContinue={onContinueEditing}
          onClear={() => {
            setIsDemoData(false);
            clearSession();
          }}
        />
      )}

      {/* Standard Hero - Always Visible */}
      <motion.div
        className="mb-12 space-y-4 text-center"
        variants={fadeInUp}
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
        variants={fadeInUp}
        className="relative"
      >
        {/* Hidden File Input - Always in DOM so "Add More" button works */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.heic"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const validFiles = Array.from(e.target.files).filter(
                f => f.type.startsWith('image/') || f.name.toLowerCase().endsWith('.heic')
              );
              if (validFiles.length > 0) {
                handleFilesSelected(validFiles);
              }
              e.target.value = '';
            }
          }}
          className="hidden"
          aria-label="Upload receipt images"
        />

        {/* Upload Dropzone with File Preview OR Manual Text Entry OR Scanning Animation */}
        {isScanning ? (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="h-[400px] w-full"
          >
            <AIScanAnimation
              mode="embedded"
              onComplete={onScanComplete}
              error={scanError} // ✨ Pass error state
              onError={handleScanError} // ✨ Handle error callback
            />
          </motion.div>
        ) : selectedFiles.length === 0 ? (
          <AnimatePresence mode="wait">
            {inputMode === 'upload' ? (
              /* Upload Mode - Dropzone */
              <UploadDropzone
                key="upload-mode"
                onFilesSelected={handleFilesSelected}
              />
            ) : (
              /* Manual Mode - Text Input */
              <ManualEntryBox
                key="manual-mode"
                value={manualText}
                onChange={setManualText}
                onParse={() => {
                  // TODO: Parse manual text and add items
                }}
              />
            )}
          </AnimatePresence>
        ) : (
          /* File Preview State */
          <FilePreviewList
            files={selectedFiles}
            previews={filePreviews}
            isProcessing={isProcessing}
            onRemoveFile={handleRemoveFile}
            onAddMore={triggerFileInput}
            onStartScanning={() => handleStartScanning(onFileUpload)}
          />
        )}
      </motion.div>

      {/* Alternative Actions - Always visible */}
      <AlternativeActions
        inputMode={inputMode}
        managementMode={managementMode}
        onToggleMode={handleManualEntryClick}
        onTryDemo={handleTryDemo}
      />

      {/* Feature Highlights - Always visible to showcase app capabilities */}
      <FeatureHighlights />

      {/* Add Item Dialog */}
      <AddItemDialog
        open={isAddItemDialogOpen}
        onClose={() => setIsAddItemDialogOpen(false)}
      />
    </motion.div>
  );
}
