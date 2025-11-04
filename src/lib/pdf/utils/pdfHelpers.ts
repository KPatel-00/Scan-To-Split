/**
 * PDF Utilities
 * Helper functions for PDF generation
 */

import type { PDFContext } from '../types';

// ============================================================================
// Text Utilities
// ============================================================================

/**
 * Add text to PDF at specified position
 */
export function addText(
  pdf: any,
  text: string,
  x: number,
  y: number,
  options?: any
): void {
  pdf.text(text, x, y, options);
}

/**
 * Wrap text to fit within max width
 */
export function wrapText(pdf: any, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = pdf.getTextWidth(testLine);
    
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

// ============================================================================
// Drawing Utilities
// ============================================================================

/**
 * Add horizontal line across page
 */
export function addLine(
  pdf: any,
  y: number,
  pageWidth: number,
  margin: number,
  color: [number, number, number] = [220, 220, 220]
): void {
  pdf.setDrawColor(...color);
  pdf.line(margin, y, pageWidth - margin, y);
}

/**
 * Add filled rectangle
 */
export function addRect(
  pdf: any,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: [number, number, number]
): void {
  pdf.setFillColor(...fillColor);
  pdf.rect(x, y, width, height, 'F');
}

// ============================================================================
// Page Management
// ============================================================================

/**
 * Check if page break is needed and add new page if necessary
 * Returns true if new page was added
 */
export function checkPageBreak(
  context: PDFContext,
  neededSpace: number
): boolean {
  if (context.yPosition + neededSpace > context.pageHeight - context.margin - 10) {
    context.pdf.addPage();
    context.yPosition = context.margin;
    return true;
  }
  return false;
}

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Format date for PDF display
 */
export function formatDate(date?: Date): string {
  const dateObj = date || new Date();
  return dateObj.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
