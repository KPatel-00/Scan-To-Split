/**
 * Shareable Image Export Module - Blueprint-Compliant Implementation with Lazy Loading
 * Part 4, Section 5.5: 1200x630px Social Media-Ready Shareable Image
 * 
 * Features:
 * - Dark gradient background with decorative blur orbs
 * - Premium header with emoji logo and branding
 * - Grand total display with gradient text effect
 * - Responsive participant grid (glassmorphic cards)
 * - Footer with item/people count + watermark
 * - **Lazy loading**: html-to-image loaded only on button click
 */

import { createRoot } from 'react-dom/client';
import { ShareableImageCard } from '../features/summary/ShareableImageCard';
import { useStore } from '../store/useStore';

interface ShareImageOptions {
  elementId?: string;
  fileName?: string;
}

export async function generateShareableImage(
  options: ShareImageOptions = {}
): Promise<Blob | null> {
  const { elementId = 'shareable-image-card' } = options;

  try {
    // **Lazy Load html-to-image** - Only loads when user clicks "Share"
    const { toPng } = await import('html-to-image');
    
    // Get current store state
    const store = useStore.getState();
    
    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    // Render the ShareableImageCard component
    const root = createRoot(container);
    root.render(
      ShareableImageCard({
        participants: store.participants,
        items: store.items,
        receipts: store.receipts,
        currency: store.currency,
        storeName: store.managementMode === 'merged' ? store.mergedStoreName : undefined,
        managementMode: store.managementMode,
        mergedTax: store.mergedTax,
        mergedTip: store.mergedTip,
      })
    );

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Generate PNG with high quality
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2, // 2x for retina displays
      cacheBust: true,
      width: 1200,
      height: 630,
    });

    // Cleanup
    root.unmount();
    document.body.removeChild(container);

    // Convert data URL to Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.error('Failed to generate shareable image:', error);
    return null;
  }
}

export async function shareImage(blob: Blob, text: string = 'Check out our bill split!'): Promise<boolean> {
  // Check if Web Share API is available
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], 'bill-split.png', { type: 'image/png' });
    
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Bill Settlement',
          text,
        });
        return true;
      } catch (error: any) {
        // User cancelled or sharing failed
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
        return false;
      }
    }
  }

  // Fallback: Download the image
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bill-split.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true;
}

export async function exportShareableImage(): Promise<boolean> {
  try {
    const blob = await generateShareableImage();
    if (!blob) {
      throw new Error('Failed to generate image');
    }

    const success = await shareImage(blob);
    return success;
  } catch (error) {
    console.error('Export shareable image failed:', error);
    return false;
  }
}
