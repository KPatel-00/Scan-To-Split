/**
 * Client-side AI scanning service for Vite
 * Calls Google Gemini API directly from the browser
 * ✨ PROMPT 9: Enhanced with graceful error messaging
 * ✨ PHASE 2: Upgraded with structured taxonomy
 * ✨ PERFORMANCE: Lazy-loads Gemini AI only when user scans receipts
 */

import { getCategoryById, getDefaultCategory } from './taxonomy';
import { categorizeFallback } from './taxonomy/fallback';
import { autoCorrectSpecialLinePrice, validateSpecialLineItem } from './taxonomy/specialLines';
import type { Category } from '../store/types';

interface ScannedItem {
  name: string;
  quantity: number;
  price: number;
  category: Category;
}

interface ScannedReceipt {
  id: string;
  storeName: string;
  date: string;
  currency: {
    symbol: string;
    code: string;
  };
  tax: number;
  tip: number;
  items: ScannedItem[];
}

interface ScanResult {
  success: boolean;
  receipts?: ScannedReceipt[];
  error?: string;
  message?: string;
}

/**
 * Client-side AI scanning service for Vite
 * Calls Google Gemini API directly from the browser
 */
export async function scanReceiptsClient(files: File[]): Promise<ScanResult> {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        error: 'AI_NOT_CONFIGURED',
        // ✨ PROMPT 9: Graceful error message
        message: "AI scanning isn't set up yet 🤖 Add your Google Gemini API key to get started, or add items manually for now!",
      };
    }

    if (!files || files.length === 0) {
      return {
        success: false,
        error: 'NO_FILES',
        message: 'No files selected. Try uploading a receipt photo! 📸',
      };
    }

    if (files.length > 3) {
      return {
        success: false,
        error: 'TOO_MANY_FILES',
        message: "Whoa! That's a lot of receipts 📄 Maximum 3 files at a time to keep things speedy.",
      };
    }

    // **Lazy Load Google Gemini AI** - Only loads when user scans receipts (not on landing page)
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const receipts: ScannedReceipt[] = [];
    const errors: string[] = [];

    // Process files in parallel
    const results = await Promise.allSettled(
      files.map(async (file, index) => {
        const bytes = await file.arrayBuffer();
        const uint8Array = new Uint8Array(bytes);
        const base64 = btoa(String.fromCharCode(...uint8Array));

        const prompt = `You are a meticulous financial assistant specializing in European and German receipts.

Your mission is to extract receipt data with the HIGHEST POSSIBLE ACCURACY using a STANDARDIZED TAXONOMY.

═══════════════════════════════════════════════════════════
📋 CATEGORIZATION RULES (MANDATORY - USE EXACT CATEGORY IDs)
═══════════════════════════════════════════════════════════

🛒 MERCHANDISE CATEGORIES:

GROC (Grocery & Food) - Use subcategories:
  • GROC.PRODUCE - Obst & Gemüse (apples, bananas, tomatoes, salad, kartoffeln, zwiebeln, ingwer)
  • GROC.DAIRY - Molkerei & Eier (milk/milch, cheese/käse, butter, yogurt/joghurt, eggs/eier, sahne)
  • GROC.BAKERY - Bäckerei (bread/brot, rolls/brötchen, croissant, kuchen, torte, tortilla)
  • GROC.MEAT - Fleisch & Geflügel (beef, pork, chicken, hackfleisch, wurst, aufschnitt)
  • GROC.SEAFOOD - Fisch & Meeresfrüchte (salmon, tuna, shrimp, fisch, lachs, krabben)
  • GROC.PANTRY - Vorrat (rice/reis, pasta/nudeln, flour/mehl, oil/öl, canned goods/konserven, sauces/soßen)
  • GROC.SNACKS - Snacks (chips, nuts/nüsse, popcorn, crackers, pringles, cashews, roestzwiebeln)
  • GROC.BEVERAGES_NA - Getränke (water/wasser, juice/saft, soda, coffee/kaffee, tea/tee, energy drinks)
  • GROC.FROZEN - Tiefkühl (frozen meals, ice cream/eis, frozen vegetables)
  • GROC.SWEETS - Süßwaren (chocolate/schokolade, candy, gum, cookies/kekse)
  • GROC.BREAKFAST - Frühstück (cereal, oats/haferflocken, spreads, jams/marmelade, honey/honig)
  • GROC.DELI - Fertiggerichte (salads/salate, sandwiches, prepared meals)
  • GROC.SPECIALTY - International (asian, latin, halal, kosher)
  • GROC.BABY - Babynahrung (baby food, formula)
  • GROC.PET - Tiernahrung (pet food within grocery stores)

ALCO - Alcoholic Beverages (beer/bier, wine/wein, spirits/schnaps, cider)
DRUG - Drugstore/Personal Care (shampoo, soap/seife, cosmetics/kosmetik, deodorant, razors)
PHAR - Health & Pharmacy OTC (pain relievers, vitamins, allergy meds, first aid)
HOME - Household Supplies (cleaning/reiniger, laundry/wäsche, paper goods/papierwaren, trash bags)
PETS - Pet Supplies (pet food, litter, toys, pet hygiene)
MISC - Miscellaneous (if you can't determine category)

═══════════════════════════════════════════════════════════
🧾 SPECIAL LINE ITEMS (CRITICAL - NEVER TREAT AS PRODUCTS)
═══════════════════════════════════════════════════════════

⚠️ DETECTION RULES (check line name carefully):

TAX - Tax/VAT/MwSt.
  ✓ DETECT: "MwSt", "USt", "Steuer", "VAT", "Tax", "inkl. MwSt", "zzgl. MwSt"
  → category_id: "TAX"
  → icon: "Receipt"

DEPO - Deposit/Pfand (POSITIVE amount)
  ✓ DETECT: "Pfand" (alone or with +), "Deposit", "Einweg", "Mehrweg", "CRV"
  → category_id: "DEPO"
  → icon: "Recycle"
  → MUST be POSITIVE price

DEPO_RET - Deposit Return/Pfandrückgabe (NEGATIVE amount)
  ✓ DETECT: "Pfandrückgabe", "Leergut", "Pfand Rückgabe", "-Pfand"
  → category_id: "DEPO_RET"
  → icon: "Undo2"
  → MUST be NEGATIVE price

DISC - Discount/Promotion (NEGATIVE amount)
  ✓ DETECT: "Rabatt", "Coupon", "Gutschein", "Discount", "-X%", "Aktion", "Ersparnis"
  → category_id: "DISC"
  → icon: "BadgePercent"
  → MUST be NEGATIVE price

FEES - Fees & Surcharges
  ✓ DETECT: "Gebühr", "Fee", "Service", "WEEE", "Recycling", "Bag fee", "Tüte"
  → category_id: "FEES"
  → icon: "AlertCircle"

TIP - Tip/Gratuity
  ✓ DETECT: "Trinkgeld", "Tip", "Gratuity", "Service charge"
  → category_id: "TIP"
  → icon: "HandCoins"

ROUND - Rounding Adjustment
  ✓ DETECT: "Rundung", "Rounding", "Abrundung", "Aufrundung"
  → category_id: "ROUND"
  → icon: "Scale"

═══════════════════════════════════════════════════════════
📸 EXTRACTION RULES
═══════════════════════════════════════════════════════════

1. Extract EVERY line item (products + special lines)
2. Combine multi-line items into a single entry
3. PRESERVE negative prices (Pfand returns, coupons, refunds)
4. If unclear, return null (do NOT hallucinate)

METADATA:
• Store name: Look at top of receipt
• Date: Format as YYYY-MM-DD
• Currency: € (EUR), $ (USD), ₹ (INR), £ (GBP)
• Tax: Usually 0 for German receipts (already included)
• Tip: Usually 0 on grocery receipts

═══════════════════════════════════════════════════════════
🎨 ICON MAPPING (use exact Lucide icon names)
═══════════════════════════════════════════════════════════

GROC.PRODUCE → "Apple" or "Carrot"
GROC.DAIRY → "Milk" or "Egg"
GROC.BAKERY → "Bread" or "Croissant"
GROC.MEAT → "Drumstick" or "Beef"
GROC.SEAFOOD → "Fish"
GROC.PANTRY → "Package" or "Can"
GROC.SNACKS → "Popcorn" or "Nut"
GROC.BEVERAGES_NA → "Coffee" or "CupSoda"
GROC.FROZEN → "Snowflake"
GROC.SWEETS → "Candy" or "Cookie"
GROC.BREAKFAST → "Egg" or "Croissant"

ALCO → "Wine" or "Beer"
DRUG → "Sparkles" or "Soap"
HOME → "SprayCan"
MISC → "Package"

TAX → "Receipt"
DEPO → "Recycle"
DEPO_RET → "Undo2"
DISC → "BadgePercent"
FEES → "AlertCircle"
TIP → "HandCoins"

═══════════════════════════════════════════════════════════
📤 OUTPUT FORMAT (JSON ONLY - NO MARKDOWN)
═══════════════════════════════════════════════════════════

Return ONLY this JSON structure (no preamble, no \`\`\`json):

{
  "storeName": "ALDI SÜD",
  "date": "2025-10-21",
  "currency": { "symbol": "€", "code": "EUR" },
  "tax": 0,
  "tip": 0,
  "items": [
    {
      "name": "Landmilch 3,8%",
      "quantity": 2,
      "price": 2.70,
      "category_id": "GROC.DAIRY",
      "icon": "Milk"
    },
    {
      "name": "Pfand",
      "quantity": 2,
      "price": 0.50,
      "category_id": "DEPO",
      "icon": "Recycle"
    },
    {
      "name": "MwSt. 7%",
      "quantity": 1,
      "price": 0.00,
      "category_id": "TAX",
      "icon": "Receipt"
    },
    {
      "name": "Pfandrückgabe",
      "quantity": 1,
      "price": -0.25,
      "category_id": "DEPO_RET",
      "icon": "Undo2"
    }
  ]
}

═══════════════════════════════════════════════════════════
🎯 EXAMPLE: ALDI RECEIPT
═══════════════════════════════════════════════════════════

INPUT:
Naturjoghurt 1kg        7.16 A
Landmilch 3,8%          2.70 A
Pfand                   0.50
Pringles 155g           7.45 A
Speisezwiebeln rot      1.78 A
Roestzwiebeln 150g      1.19 A
XXL Cashewkerne         4.99 A
Bananen RFA             0.78 A
Ingwer Bio              0.11 A
Rispentomaten lose      1.20 A
--------------------------------
Summe                  29.44
VISA                   29.44

OUTPUT:
{
  "storeName": "ALDI SÜD",
  "date": "2025-10-21",
  "currency": { "symbol": "€", "code": "EUR" },
  "tax": 0,
  "tip": 0,
  "items": [
    { "name": "Naturjoghurt 1kg", "quantity": 4, "price": 7.16, "category_id": "GROC.DAIRY", "icon": "Milk" },
    { "name": "Landmilch 3,8%", "quantity": 2, "price": 2.70, "category_id": "GROC.DAIRY", "icon": "Milk" },
    { "name": "Pfand", "quantity": 2, "price": 0.50, "category_id": "DEPO", "icon": "Recycle" },
    { "name": "Pringles 155g", "quantity": 5, "price": 7.45, "category_id": "GROC.SNACKS", "icon": "Package" },
    { "name": "Speisezwiebeln rot", "quantity": 2, "price": 1.78, "category_id": "GROC.PRODUCE", "icon": "Apple" },
    { "name": "Roestzwiebeln 150g", "quantity": 1, "price": 1.19, "category_id": "GROC.SNACKS", "icon": "Package" },
    { "name": "XXL Cashewkerne", "quantity": 1, "price": 4.99, "category_id": "GROC.SNACKS", "icon": "Nut" },
    { "name": "Bananen RFA", "quantity": 1, "price": 0.78, "category_id": "GROC.PRODUCE", "icon": "Apple" },
    { "name": "Ingwer Bio", "quantity": 1, "price": 0.11, "category_id": "GROC.PRODUCE", "icon": "Leaf" },
    { "name": "Rispentomaten lose", "quantity": 1, "price": 1.20, "category_id": "GROC.PRODUCE", "icon": "Cherry" }
  ]
}

═══════════════════════════════════════════════════════════

NOW EXTRACT THE RECEIPT:`;

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: file.type,
              data: base64,
            },
          },
          { text: prompt },
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Could not parse AI response');
        }

        const data = JSON.parse(jsonMatch[0]);

        // Map items with taxonomy integration
        const items = (data.items || []).map((item: any) => {
          // AI returns category_id (e.g., "GROC.DAIRY", "TAX", "DEPO")
          const categoryId = item.category_id || 'MISC';
          
          // Look up full category object from taxonomy
          let category = getCategoryById(categoryId);
          
          // If not found, try fallback categorization
          if (!category) {
            console.warn(`⚠️ Category not found: ${categoryId}, trying fallback categorization`);
            category = categorizeFallback(item.name);
          }
          
          // Final fallback to default
          if (!category) {
            category = getDefaultCategory();
          }

          // Auto-correct special line prices
          const correctedPrice = autoCorrectSpecialLinePrice(
            category.id,
            item.price || 0
          );

          // Validate and warn
          const validation = validateSpecialLineItem(
            category.id,
            correctedPrice,
            item.name || 'Unknown Item'
          );
          
          if (!validation.valid) {
            console.warn(`⚠️ Special line validation failed:`, validation.errors);
          }
          if (validation.warnings.length > 0) {
            console.warn(`⚠️ Special line warnings:`, validation.warnings);
          }
          
          return {
            name: item.name || 'Unknown Item',
            quantity: item.quantity || 1,
            price: correctedPrice,
            category: {
              id: category.id,
              code: category.code,
              name_en: category.name_en,
              name_de: category.name_de,
              icon: item.icon || category.icon,  // AI can override icon
              isSpecialLine: category.isSpecialLine,
            },
          };
        });

        // Additional validation for special lines (legacy - now handled above)
        items.forEach((item: ScannedItem) => {
          const categoryId = item.category.id;
          
          // DEPO must be positive
          if (categoryId === 'DEPO' && item.price < 0) {
            console.warn(`⚠️ Deposit has negative price: ${item.name} (${item.price}), switching to DEPO_RET`);
            const depoRetCategory = getCategoryById('DEPO_RET');
            if (depoRetCategory) {
              item.category = {
                id: depoRetCategory.id,
                code: depoRetCategory.code,
                name_en: depoRetCategory.name_en,
                name_de: depoRetCategory.name_de,
                icon: depoRetCategory.icon,
                isSpecialLine: depoRetCategory.isSpecialLine,
              };
            }
          }
          
          // DEPO_RET must be negative
          if (categoryId === 'DEPO_RET' && item.price > 0) {
            console.warn(`⚠️ Deposit return has positive price: ${item.name} (${item.price}), forcing negative`);
            item.price = -Math.abs(item.price);  // Force negative
          }
          
          // DISC must be negative
          if (categoryId === 'DISC' && item.price > 0) {
            console.warn(`⚠️ Discount has positive price: ${item.name} (${item.price}), forcing negative`);
            item.price = -Math.abs(item.price);  // Force negative
          }
        });

        return {
          id: `receipt-${Date.now()}-${index}`,
          storeName: data.storeName || 'Unknown Store',
          date: data.date || new Date().toISOString().split('T')[0],
          currency: data.currency || { symbol: '€', code: 'EUR' },
          tax: data.tax || 0,
          tip: data.tip || 0,
          items,
        };
      })
    );

    // Collect results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        receipts.push(result.value);
      } else {
        errors.push(`File ${index + 1}: ${result.reason.message || 'Unknown error'}`);
      }
    });

    if (receipts.length === 0) {
      return {
        success: false,
        error: 'SCAN_FAILED',
        // ✨ PROMPT 9: Graceful error message
        message: "Couldn't read those receipts 🔍 The images might be blurry or the format is tricky. Try a clearer photo or add items manually!",
      };
    }

    return {
      success: true,
      receipts,
    };
  } catch (error: any) {
    return {
      success: false,
      error: 'UNEXPECTED_ERROR',
      // ✨ PROMPT 9: Graceful error message
      message: error.message || "Unexpected hiccup 🤔 Something didn't go as planned. Try again or add items manually!",
    };
  }
}
