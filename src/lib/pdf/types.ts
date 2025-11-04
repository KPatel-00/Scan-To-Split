/**
 * PDF Type Definitions
 * Shared types for PDF generation system
 */

import type { Participant, Item, Receipt } from '../../store/useStore';
import type { ParticipantBalance, Transaction } from '../settlement';

export interface PDFExportData {
  participants: Participant[];
  items: Item[];
  receipts: Receipt[];
  currency: {
    symbol: string;
    code: string;
  };
  managementMode: 'merged' | 'separate';
  mergedStoreName?: string;
  mergedDate?: string;
  mergedTax?: number;
  mergedTip?: number;
  compressedReceiptImages?: string[]; // Base64 data URLs (optional)
}

export interface ParticipantPDFData {
  participant: Participant;
  balance: ParticipantBalance;
  items: { item: Item; share: number; origin?: string }[];
  itemsByReceipt?: Map<string, { item: Item; share: number }[]>; // For separate mode
}

export interface PDFContext {
  pdf: any; // jsPDF instance
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  yPosition: number;
  currencySymbol: string;
  data: PDFExportData;
  balances: ParticipantBalance[];
  transactions: Transaction[];
  grandTotal: number;
  sources: string;
  participantData: ParticipantPDFData[];
}

export interface PDFGeneratorResult {
  yPosition: number;
}
