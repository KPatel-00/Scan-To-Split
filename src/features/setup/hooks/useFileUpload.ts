import { useTranslation } from 'react-i18next';
import { useToast } from '../../../hooks/useToast';
import { feedback } from '../../../lib/feedback';
import { detectPIIBatch, createRedactedImage } from '../../../lib/piiDetection';
import { scanReceiptsClient } from '../../../lib/scanReceiptsClient';
import imageCompression from 'browser-image-compression';
import { useStore } from '../../../store/useStore';

/**
 * ✨ REFACTORED: useFileUpload hook
 * Now uses Zustand store for all scanning state instead of local useState
 * Eliminates state management complexity and enables global access
 */
export function useFileUpload() {
  const { t } = useTranslation();
  const { toast } = useToast();

  // ✨ REFACTORED: Read from scanning slice (for internal use)
  const piiDetections = useStore((state) => state.piiDetections);
  const pendingFiles = useStore((state) => state.pendingFiles);
  const scannedReceiptsData = useStore((state) => state.scannedReceiptsData);

  // ✨ REFACTORED: Use store actions instead of local setState
  const startScanning = useStore((state) => state.startScanning);
  const stopScanning = useStore((state) => state.stopScanning);
  const setPIIDetections = useStore((state) => state.setPIIDetections);
  const setPendingFiles = useStore((state) => state.setPendingFiles);
  const setScannedReceiptsData = useStore((state) => state.setScannedReceiptsData);
  const setScanError = useStore((state) => state.setScanError);

  // Modal actions
  const openPIIRedactionModal = useStore((state) => state.openPIIRedactionModal);
  const closePIIRedactionModal = useStore((state) => state.closePIIRedactionModal);
  const openMultiBillModal = useStore((state) => state.openMultiBillModal);
  const closeMultiBillModal = useStore((state) => state.closeMultiBillModal);

  // Domain actions
  const addItem = useStore((state) => state.addItem);
  const addScannedData = useStore((state) => state.addScannedData);
  const setManagementMode = useStore((state) => state.setManagementMode);
  const setCurrency = useStore((state) => state.setCurrency);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    feedback.click();

    const fileCount = Math.min(files.length, 3);
    const fileArray = Array.from(files).slice(0, fileCount);

    try {
      // Step 1: Compress images (Pre-Upload Compression)
      const compressionOptions = {
        maxSizeMB: 0.5, // 500KB target
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg',
      };

      const compressedFiles = await Promise.all(
        fileArray.map((file) => imageCompression(file, compressionOptions))
      );

      // Step 2: PII Detection (Intelligent Sanitization Flow)
      const detections = await detectPIIBatch(compressedFiles);
      const hasPII = detections.some((d) => d.found);

      if (hasPII) {
        // Case B: PII Found - Show redaction modal
        setPIIDetections(detections);
        setPendingFiles(compressedFiles);
        openPIIRedactionModal(); // ✨ Store action
      } else {
        // Case A: No PII - Proceed directly to upload
        await uploadAndScan(compressedFiles);
      }
    } catch (error: any) {
      feedback.error();
      toast({
        title: t('messages.compressionError', 'Failed to process images'),
        description: t('messages.compressionErrorDesc', 'Please try again with different images.'),
        variant: 'destructive',
      });
    }
  };

  const handleConfirmMasked = async () => {
    try {
      // Create redacted versions of images
      const redactedFiles = await Promise.all(
        piiDetections.map((detection, index) =>
          createRedactedImage(pendingFiles[index], detection.patterns)
        )
      );

      closePIIRedactionModal(); // ✨ Store action
      await uploadAndScan(redactedFiles);
    } catch (error) {
      feedback.error();
      toast({
        title: t('messages.redactionError', 'Failed to redact images'),
        description: t('messages.redactionErrorDesc', 'Please try again.'),
        variant: 'destructive',
      });
    }
  };

  const handleScanOriginal = async () => {
    closePIIRedactionModal(); // ✨ Store action
    await uploadAndScan(pendingFiles);
  };

  const uploadAndScan = async (files: File[]) => {
    startScanning(files.length); // ✨ Compound store action
    feedback.scan();

    try {
      // Use client-side AI scanning (Vite version)
      const result = await scanReceiptsClient(files);

      // Handle errors
      if (!result.success) {
        // ✨ Store error state instead of stopping immediately
        // This allows the UI to finish the "Got it" animation before showing the error
        setScanError(result.message || 'Could not scan receipt');
        return;
      }

      // Process successfully scanned receipts
      if (result.receipts && result.receipts.length > 0) {
        // **Blueprint Requirement: Auto-detect and set currency**
        const firstReceipt = result.receipts[0];
        if (firstReceipt.currency) {
          setCurrency(firstReceipt.currency);
          feedback.notification();
          toast({
            title: t('messages.currencyDetected', '💱 Currency Detected'),
            description: `${t('messages.currencySet', 'Set to')} ${firstReceipt.currency.symbol} (${firstReceipt.currency.code})`,
            duration: 3000,
          });
        }

        // Show multi-bill modal if multiple receipts scanned
        if (result.receipts.length > 1) {
          setScannedReceiptsData(result.receipts);
          openMultiBillModal(); // ✨ Store action
          feedback.success();
        } else {
          // Single receipt - add items directly in merged mode
          setManagementMode('merged'); // Default to merged for single receipt
          let totalItemsAdded = 0;
          result.receipts.forEach((receipt: any) => {
            receipt.items.forEach((item: any) => {
              addItem({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                category: item.category,
              });
              totalItemsAdded++;
            });
          });

          feedback.success();
          toast({
            title: t('messages.scanComplete'),
            description: t('messages.itemsAdded', { count: totalItemsAdded }),
          });
        }
      }
    } catch (error: any) {
      // ✨ Store error state instead of stopping immediately
      let errorMessage = t('messages.scanErrorDesc');

      if (error.message?.includes('network')) {
        errorMessage = t('messages.networkError', 'Network error. Please check your connection and try again.');
      } else if (error.message?.includes('timeout')) {
        errorMessage = t('messages.timeoutError', 'Request timed out. The receipt may be too large. Try a smaller image.');
      }

      setScanError(errorMessage);
    }
    // ✨ REMOVED finally block that stopped scanning
    // Scanning stop is now handled by the UI (ScanPortal) after animation completes or error is shown
  };

  const handleMultiBillConfirm = (mode: 'merged' | 'separate') => {
    feedback.click();
    setManagementMode(mode);

    if (mode === 'merged') {
      // Merged mode: Add all items to single items array
      let totalItemsAdded = 0;
      scannedReceiptsData.forEach((receipt: any) => {
        receipt.items.forEach((item: any) => {
          addItem({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category,
          });
          totalItemsAdded++;
        });
      });

      toast({
        title: t('messages.scanComplete'),
        description: t('messages.itemsAdded', { count: totalItemsAdded }),
      });
    } else {
      // Separate mode: Add data to receipts array
      addScannedData(scannedReceiptsData);

      toast({
        title: t('messages.scanComplete'),
        description: t('setup.multiBill.modal.separate.confirmed', 'Managing {{count}} bills separately', {
          count: scannedReceiptsData.length,
        }),
      });
    }

    closeMultiBillModal(); // ✨ Store action
    setScannedReceiptsData([]); // Clear scanned data after confirmation
  };

  // ✨ REFACTORED: Return only handlers, state is in store
  return {
    handleFileUpload,
    handleConfirmMasked,
    handleScanOriginal,
    handleMultiBillConfirm,
  };
}

