/**
 * PDF Export Module - Blueprint-Compliant Implementation with Lazy Loading
 * Part 4, Section 6: Professional, Lightweight, Dual-Path PDF Export
 * 
 * Features:
 * - Clean text-and-table design (< 2MB target)
 * - Dual-path architecture (merged vs separate modes)
 * - Settlement summary with minimum transactions
 * - 2-column participant grid for space efficiency
 * - Negative price highlighting
 * - Optional compressed receipt images in appendix
 * - **Lazy loading**: jsPDF loaded only on button click
 */

import type { PDFExportData, PDFContext } from './types';
import { prepareData } from './utils/dataPreparation';
import { generateHeader } from './generators/headerGenerator';
import { generateSummary } from './generators/summaryGenerator';
import { generateParticipants } from './generators/participantsGenerator';
import { generateItems } from './generators/itemsGenerator';
import { generateFooter } from './generators/footerGenerator';

// Re-export types for external use
export type { PDFExportData } from './types';

/**
 * Main PDF export function with lazy loading
 */
export async function exportToPDF(data: PDFExportData): Promise<void> {
  // **Lazy Load jsPDF** - Only loads when user clicks "Download PDF"
  const { default: jsPDF } = await import('jspdf');
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  
  const currencySymbol = data.currency.symbol;

  // Prepare all data
  const {
    sources,
    balances,
    transactions,
    grandTotal,
    participantData,
  } = prepareData(data);

  // Create context object shared across all generators
  const context: PDFContext = {
    pdf,
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    yPosition: margin,
    currencySymbol,
    data,
    balances,
    transactions,
    grandTotal,
    sources,
    participantData,
  };

  // Generate each section in order
  const headerResult = generateHeader(context);
  context.yPosition = headerResult.yPosition;

  const summaryResult = generateSummary(context);
  context.yPosition = summaryResult.yPosition;

  const participantsResult = generateParticipants(context);
  context.yPosition = participantsResult.yPosition;

  generateItems(context);
  // Note: items generator may add new pages, so we don't update yPosition

  // Add footer to all pages
  generateFooter(pdf, pageWidth, pageHeight);

  // Save PDF
  const fileName = `scantosplit-settlement-${new Date().getTime()}.pdf`;
  pdf.save(fileName);
}
