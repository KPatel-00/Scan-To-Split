/**
 * PDF Items/Receipts Generator
 * Generates the optional compressed receipt images appendix
 */

import type { PDFContext, PDFGeneratorResult } from '../types';
import { addText, checkPageBreak } from '../utils/pdfHelpers';
import { colors, fontSizes, spacing } from '../styles/pdfStyles';

/**
 * Generate compressed receipt images section (optional)
 */
export function generateItems(context: PDFContext): PDFGeneratorResult {
  const { pdf, margin, contentWidth, data } = context;
  let yPosition = context.yPosition;

  // Only generate if there are compressed receipt images
  if (!data.compressedReceiptImages || data.compressedReceiptImages.length === 0) {
    return { yPosition };
  }

  // Add new page for receipts
  pdf.addPage();
  yPosition = margin;

  // Section header
  pdf.setFontSize(fontSizes.sectionHeader);
  pdf.setFont('helvetica', 'bold');
  addText(pdf, 'Original Receipt(s) (Compressed for size)', margin, yPosition);
  yPosition += spacing.betweenSections;

  const imageWidth = contentWidth;
  const imageMaxHeight = spacing.imageMaxHeight;

  data.compressedReceiptImages.forEach((imageDataUrl, index) => {
    // Update context for page break check
    context.yPosition = yPosition;
    checkPageBreak(context, imageMaxHeight + 15);
    yPosition = context.yPosition;

    pdf.setFontSize(fontSizes.normal);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(...colors.darkGray);
    addText(pdf, `Receipt ${index + 1}`, margin, yPosition);
    yPosition += 5;

    try {
      pdf.addImage(imageDataUrl, 'JPEG', margin, yPosition, imageWidth, imageMaxHeight);
      yPosition += imageMaxHeight + 5;
    } catch (error) {
      console.error(`Failed to embed receipt ${index + 1}:`, error);
      pdf.setTextColor(...colors.red);
      addText(pdf, `[Image failed to load]`, margin, yPosition);
      yPosition += spacing.betweenSections;
    }

    pdf.setTextColor(...colors.black);
  });

  return { yPosition };
}
