/**
 * PDF Styles
 * Colors, fonts, and spacing constants for PDF generation
 */

// ============================================================================
// Colors
// ============================================================================

export const colors = {
  // Text colors
  black: [0, 0, 0] as [number, number, number],
  darkGray: [80, 80, 80] as [number, number, number],
  gray: [100, 100, 100] as [number, number, number],
  lightGray: [120, 120, 120] as [number, number, number],
  veryLightGray: [140, 140, 140] as [number, number, number],
  
  // Status colors
  red: [220, 38, 38] as [number, number, number],
  darkRed: [185, 28, 28] as [number, number, number],
  green: [34, 139, 34] as [number, number, number],
  
  // Background colors
  lightBackground: [245, 245, 245] as [number, number, number],
  
  // Line colors
  lightLine: [220, 220, 220] as [number, number, number],
  mediumLine: [180, 180, 180] as [number, number, number],
};

// ============================================================================
// Font Sizes
// ============================================================================

export const fontSizes = {
  title: 22,
  sectionHeader: 14,
  subheader: 11,
  normal: 10,
  small: 9,
  tiny: 8,
  footer: 7,
};

// ============================================================================
// Spacing
// ============================================================================

export const spacing = {
  // Page margins
  pageMargin: 15,
  
  // Vertical spacing
  afterTitle: 7,
  afterSubtitle: 3,
  afterSectionHeader: 8,
  afterLine: 8,
  betweenItems: 4.5,
  betweenItemsWithOrigin: 6,
  betweenSections: 10,
  columnGap: 5,
  
  // Heights
  participantHeaderHeight: 10,
  statusBadgeHeight: 6,
  receiptHeadingHeight: 5,
  imageMaxHeight: 100,
};

// ============================================================================
// Layout
// ============================================================================

export const layout = {
  // Column configuration for participant summaries
  calculateColumnWidth: (contentWidth: number) => (contentWidth - spacing.columnGap) / 2,
  
  // Page break buffer
  pageBreakBuffer: 10,
};
