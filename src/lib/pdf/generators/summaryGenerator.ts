/**
 * PDF Settlement Summary Generator
 * Generates the settlement summary section showing who pays whom
 */

import type { PDFContext, PDFGeneratorResult } from '../types';
import { addText, addLine, checkPageBreak } from '../utils/pdfHelpers';
import { colors, fontSizes, spacing } from '../styles/pdfStyles';

/**
 * Generate settlement summary section
 */
export function generateSummary(context: PDFContext): PDFGeneratorResult {
  const { pdf, margin, pageWidth, transactions, currencySymbol } = context;
  let yPosition = context.yPosition;

  // Section header
  pdf.setFontSize(fontSizes.sectionHeader);
  pdf.setFont('helvetica', 'bold');
  addText(pdf, 'Final Settlement', margin, yPosition);
  yPosition += spacing.afterSectionHeader;

  if (transactions.length === 0) {
    // Everyone is even
    pdf.setFontSize(fontSizes.normal);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(...colors.green);
    addText(pdf, '🎉 Everyone is even! No payments needed.', margin + 2, yPosition);
    pdf.setTextColor(...colors.black);
    yPosition += spacing.betweenSections;
  } else {
    // List transactions
    pdf.setFontSize(fontSizes.normal);
    pdf.setFont('helvetica', 'normal');

    transactions.forEach((transaction) => {
      checkPageBreak(context, 6);
      const text = `${transaction.from} pays ${transaction.to} ${currencySymbol}${transaction.amount.toFixed(2)}`;
      addText(pdf, `• ${text}`, margin + 2, yPosition);
      yPosition += 5.5;
    });

    yPosition += 4;
  }

  addLine(pdf, yPosition, pageWidth, margin, colors.mediumLine);
  yPosition += spacing.betweenSections;

  return { yPosition };
}
