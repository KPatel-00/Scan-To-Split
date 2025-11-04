/**
 * PDF Participants Generator
 * Generates the 2-column participant summaries section
 */

import type { PDFContext, PDFGeneratorResult, ParticipantPDFData } from '../types';
import { addText, addRect } from '../utils/pdfHelpers';
import { colors, fontSizes, spacing, layout } from '../styles/pdfStyles';

/**
 * Generate participant summaries in 2-column layout
 */
export function generateParticipants(context: PDFContext): PDFGeneratorResult {
  const { pdf, margin, pageHeight, contentWidth, currencySymbol, participantData, data } = context;
  let yPosition = context.yPosition;

  // Section header
  pdf.setFontSize(fontSizes.sectionHeader);
  pdf.setFont('helvetica', 'bold');
  addText(pdf, 'Participant Summaries', margin, yPosition);
  yPosition += spacing.afterSectionHeader;

  const columnWidth = layout.calculateColumnWidth(contentWidth);
  let currentColumn = 0; // 0 = left, 1 = right
  let columnYPosition = yPosition;

  participantData.forEach((pd) => {
    const xOffset = currentColumn === 0 ? margin : margin + columnWidth + spacing.columnGap;

    // Estimate space needed for this participant block
    const estimatedHeight = 15 + (pd.items.length * 5) + 
      (pd.itemsByReceipt ? Array.from(pd.itemsByReceipt.values()).reduce((sum, items) => sum + items.length * 5 + 8, 0) : 0);

    // Check if we need a new page
    if (columnYPosition + estimatedHeight > pageHeight - margin - layout.pageBreakBuffer) {
      if (currentColumn === 0) {
        // Move to right column
        currentColumn = 1;
        columnYPosition = yPosition;
      } else {
        // Add new page
        pdf.addPage();
        yPosition = margin;
        columnYPosition = yPosition;
        currentColumn = 0;
      }
    }

    const startY = columnYPosition;

    // Participant header (gray background)
    addRect(pdf, xOffset, startY - 4, columnWidth, spacing.participantHeaderHeight, colors.lightBackground);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(fontSizes.subheader);
    pdf.setTextColor(...colors.black);
    addText(pdf, pd.participant.name, xOffset + 2, startY);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(fontSizes.small);
    addText(pdf, `${currencySymbol}${pd.balance.totalCost.toFixed(2)}`, xOffset + columnWidth - 2, startY, { align: 'right' });
    
    columnYPosition += spacing.afterSectionHeader;

    // Status badge
    pdf.setFontSize(fontSizes.tiny);
    if (Math.abs(pd.balance.balance) < 0.01) {
      pdf.setTextColor(...colors.gray);
      addText(pdf, 'Status: Even', xOffset + 2, columnYPosition);
    } else if (pd.balance.balance < 0) {
      pdf.setTextColor(...colors.red);
      addText(pdf, `Status: Owes ${currencySymbol}${Math.abs(pd.balance.balance).toFixed(2)}`, xOffset + 2, columnYPosition);
    } else {
      pdf.setTextColor(...colors.green);
      addText(pdf, `Status: Owed ${currencySymbol}${pd.balance.balance.toFixed(2)}`, xOffset + 2, columnYPosition);
    }
    pdf.setTextColor(...colors.black);
    columnYPosition += spacing.statusBadgeHeight;

    // Itemized list
    pdf.setFontSize(fontSizes.tiny);
    pdf.setFont('helvetica', 'normal');

    if (data.managementMode === 'merged') {
      columnYPosition = renderMergedModeItems(pdf, pd, xOffset, columnYPosition, columnWidth, currencySymbol);
    } else {
      columnYPosition = renderSeparateModeItems(pdf, pd, xOffset, columnYPosition, columnWidth, currencySymbol);
    }

    columnYPosition += 3;

    // Alternate columns
    if (currentColumn === 0) {
      currentColumn = 1;
      columnYPosition = yPosition;
    } else {
      currentColumn = 0;
      yPosition = columnYPosition;
    }
  });

  // Adjust yPosition after 2-column layout
  if (currentColumn === 1) {
    yPosition = columnYPosition;
  }

  yPosition += 5;

  return { yPosition };
}

/**
 * Render items for merged mode (single table with origin badges)
 */
function renderMergedModeItems(
  pdf: any,
  pd: ParticipantPDFData,
  xOffset: number,
  yPosition: number,
  columnWidth: number,
  currencySymbol: string
): number {
  if (pd.items.length === 0) {
    pdf.setTextColor(...colors.lightGray);
    addText(pdf, 'No items assigned', xOffset + 3, yPosition);
    pdf.setTextColor(...colors.black);
    return yPosition + 5;
  }

  pd.items.forEach((itemData) => {
    // Check for negative price (highlight in red)
    const isNegative = itemData.item.price < 0;
    if (isNegative) {
      pdf.setTextColor(...colors.darkRed);
    }

    const itemText = `${itemData.item.name}`;
    const shareText = `${currencySymbol}${itemData.share.toFixed(2)}`;
    const originText = itemData.origin ? `[${itemData.origin}]` : '';

    addText(pdf, itemText, xOffset + 3, yPosition);
    if (originText) {
      pdf.setFontSize(7);
      pdf.setTextColor(...colors.gray);
      addText(pdf, originText, xOffset + 3, yPosition + 3);
      pdf.setFontSize(fontSizes.tiny);
      pdf.setTextColor(...(isNegative ? colors.darkRed : colors.black));
    }
    addText(pdf, shareText, xOffset + columnWidth - 3, yPosition, { align: 'right' });

    if (isNegative || originText) {
      pdf.setTextColor(...colors.black);
    }

    yPosition += originText ? spacing.betweenItemsWithOrigin : spacing.betweenItems;
  });

  return yPosition;
}

/**
 * Render items for separate mode (grouped by receipt)
 */
function renderSeparateModeItems(
  pdf: any,
  pd: ParticipantPDFData,
  xOffset: number,
  yPosition: number,
  columnWidth: number,
  currencySymbol: string
): number {
  if (!pd.itemsByReceipt || pd.itemsByReceipt.size === 0) {
    pdf.setTextColor(...colors.lightGray);
    addText(pdf, 'No items assigned', xOffset + 3, yPosition);
    pdf.setTextColor(...colors.black);
    return yPosition + 5;
  }

  pd.itemsByReceipt.forEach((items, storeName) => {
    // Receipt heading
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(fontSizes.tiny);
    addText(pdf, `Items from ${storeName}`, xOffset + 3, yPosition);
    pdf.setFont('helvetica', 'normal');
    yPosition += spacing.receiptHeadingHeight;

    // Items
    items.forEach((itemData) => {
      const isNegative = itemData.item.price < 0;
      if (isNegative) {
        pdf.setTextColor(...colors.darkRed);
      }

      const itemText = `  ${itemData.item.name}`;
      const shareText = `${currencySymbol}${itemData.share.toFixed(2)}`;

      addText(pdf, itemText, xOffset + 3, yPosition);
      addText(pdf, shareText, xOffset + columnWidth - 3, yPosition, { align: 'right' });

      if (isNegative) {
        pdf.setTextColor(...colors.black);
      }

      yPosition += spacing.betweenItems;
    });

    yPosition += 2;
  });

  return yPosition;
}
