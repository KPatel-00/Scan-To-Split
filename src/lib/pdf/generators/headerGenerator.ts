/**
 * PDF Header Generator
 * Generates the header section of the PDF
 */

import type { PDFContext, PDFGeneratorResult } from '../types';
import { addText, addLine, wrapText, formatDate } from '../utils/pdfHelpers';
import { colors, fontSizes, spacing } from '../styles/pdfStyles';
import { APP_NAME } from '@/lib/constants/app';

/**
 * Generate PDF header with logo, grand total, and bill sources
 */
export function generateHeader(context: PDFContext): PDFGeneratorResult {
  const { pdf, margin, pageWidth, contentWidth, grandTotal, currencySymbol, sources } = context;
  let yPosition = context.yPosition;

  // Left: App logo and name
  pdf.setFontSize(fontSizes.title);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.black);
  addText(pdf, `📸 ${APP_NAME}`, margin, yPosition);

  // Right: Grand Total and Date
  pdf.setFontSize(fontSizes.subheader);
  pdf.setFont('helvetica', 'bold');
  const headerRight1 = `Grand Total: ${currencySymbol}${grandTotal.toFixed(2)}`;
  const headerRight2 = `Date: ${formatDate()}`;
  addText(pdf, headerRight1, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fontSizes.normal);
  addText(pdf, headerRight2, pageWidth - margin, yPosition + 1, { align: 'right' });
  yPosition += spacing.afterTitle;

  // Bill Sources sub-heading
  pdf.setFontSize(fontSizes.normal);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(...colors.darkGray);
  const sourcesText = `From: ${sources}`;
  const wrappedSources = wrapText(pdf, sourcesText, contentWidth);
  wrappedSources.forEach(line => {
    addText(pdf, line, margin, yPosition);
    yPosition += 5;
  });
  yPosition += spacing.afterSubtitle;

  pdf.setTextColor(...colors.black);
  addLine(pdf, yPosition, pageWidth, margin, colors.mediumLine);
  yPosition += spacing.afterLine;

  return { yPosition };
}
