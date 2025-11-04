/**
 * Client-Side Image Compression Utility
 * 
 * Compresses and resizes images in the browser BEFORE upload to:
 * - Reduce upload time (faster UX)
 * - Save user bandwidth (mobile-friendly)
 * - Lower API processing costs (smaller payloads)
 * - Enhance privacy (processed locally)
 * 
 * Target: <500KB per image, max 1600px width
 */

import imageCompression from 'browser-image-compression';

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // e.g., 0.25 = 75% reduction
}

/**
 * Compression options optimized for receipt images
 */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5, // Target 500KB
  maxWidthOrHeight: 1600, // Max dimension (preserves aspect ratio)
  useWebWorker: true, // Offload to Web Worker (non-blocking UI)
  fileType: 'image/jpeg', // JPEG is best for photos
  initialQuality: 0.85, // High quality (AI needs clarity)
};

/**
 * Compress a single image file
 * 
 * @param file - Original image file
 * @param onProgress - Optional progress callback (0-100)
 * @returns Compression result with compressed file
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<CompressionResult> {
  try {
    const originalSize = file.size;

    // Compress the image
    const compressedBlob = await imageCompression(file, {
      ...COMPRESSION_OPTIONS,
      onProgress: (percent) => {
        if (onProgress) {
          onProgress(percent);
        }
      },
    });

    // Convert blob to file (preserve original name)
    const compressedFile = new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });

    const compressedSize = compressedFile.size;
    const compressionRatio = compressedSize / originalSize;

    return {
      file: compressedFile,
      originalSize,
      compressedSize,
      compressionRatio,
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    // Fallback: return original file if compression fails
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 1,
    };
  }
}

/**
 * Compress multiple images in parallel (batch upload)
 * 
 * @param files - Array of original image files (max 3)
 * @param onProgress - Optional progress callback per file
 * @returns Array of compression results
 */
export async function compressImages(
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<CompressionResult[]> {
  // Validate batch size
  if (files.length > 3) {
    throw new Error('Maximum 3 files allowed');
  }

  // Compress all files in parallel (fastest)
  const compressionPromises = files.map((file, index) =>
    compressImage(file, (progress) => {
      if (onProgress) {
        onProgress(index, progress);
      }
    })
  );

  return Promise.all(compressionPromises);
}

/**
 * Format file size for display (e.g., "1.5 MB", "450 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get compression stats for display (e.g., "Compressed 75%")
 */
export function getCompressionStats(result: CompressionResult): string {
  const reductionPercent = Math.round((1 - result.compressionRatio) * 100);
  
  if (reductionPercent <= 0) {
    return 'No compression needed';
  }

  return `Compressed ${reductionPercent}% (${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)})`;
}

/**
 * Validate image file before compression
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPG, PNG, or HEIC images.',
    };
  }

  // Check file size (max 25MB before compression)
  const maxSize = 25 * 1024 * 1024; // 25MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 25MB.',
    };
  }

  return { valid: true };
}
