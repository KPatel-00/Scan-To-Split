# 13. AI Prompt & Taxonomy System

This document contains the "brain" of the application: the exact prompt sent to Google Gemini and the categorization system used to organize the data.

---

## 1. The AI Prompt
**File:** `src/lib/scanReceiptsClient.ts`

This prompt is injected into the Gemini API call. It instructs the AI on how to parse the receipt, handle German-specific edge cases (Pfand, MwSt), and format the output.

```typescript
const prompt = \`You are a meticulous financial assistant specializing in European and German receipts.

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

NOW EXTRACT THE RECEIPT:\`;
```

---

## 2. The Taxonomy Data
**File:** `src/lib/taxonomy/data/categories.json`

This JSON file defines the structure of the categories used in the app. It maps IDs to names (English/German), icons, and keywords.

```json
{
  "version": "1.0.0",
  "icon_pack": "lucide-react",
  "locale_support": ["en", "de"],
  "categories": [
    {
      "id": "GROC",
      "code": "GROC",
      "name_en": "Grocery & Food",
      "name_de": "Lebensmittel",
      "icon": "ShoppingCart",
      "synonyms": ["market", "supermarket", "grocery", "lebensmittel", "frischware", "lebensm.", "food"],
      "children": [
        {
          "id": "GROC.PRODUCE",
          "name_en": "Produce",
          "name_de": "Obst & Gemüse",
          "icon": "Apple",
          "keywords": ["apples", "bananas", "tomatoes", "salad", "lettuce", "kartoffeln", "obst", "gemüse", "kräuter", "pilze", "bio"]
        },
        {
          "id": "GROC.MEAT",
          "name_en": "Meat & Poultry",
          "name_de": "Fleisch & Geflügel",
          "icon": "Drumstick",
          "keywords": ["beef", "pork", "chicken", "turkey", "hackfleisch", "wurst", "aufschnitt", "deli"]
        },
        {
          "id": "GROC.SEAFOOD",
          "name_en": "Seafood",
          "name_de": "Fisch & Meeresfrüchte",
          "icon": "Fish",
          "keywords": ["salmon", "tuna", "shrimp", "fisch", "krabben", "lachs"]
        },
        {
          "id": "GROC.DAIRY",
          "name_en": "Dairy & Eggs",
          "name_de": "Molkerei & Eier",
          "icon": "Egg",
          "keywords": ["milk", "cheese", "butter", "joghurt", "sahne", "eier"]
        },
        {
          "id": "GROC.BAKERY",
          "name_en": "Bakery",
          "name_de": "Bäckerei",
          "icon": "Bread",
          "keywords": ["bread", "rolls", "brötchen", "croissant", "kuchen", "torte", "tortilla"]
        },
        {
          "id": "GROC.PANTRY",
          "name_en": "Pantry & Staples",
          "name_de": "Vorrat",
          "icon": "Box",
          "keywords": ["rice", "pasta", "flour", "mehl", "zucker", "öl", "essig", "konserven", "sauce"]
        },
        {
          "id": "GROC.BREAKFAST",
          "name_en": "Breakfast",
          "name_de": "Frühstück",
          "icon": "Croissant",
          "keywords": ["cereal", "oats", "müsli", "jam", "honig", "spreads", "peanut butter"]
        },
        {
          "id": "GROC.SNACKS",
          "name_en": "Snacks",
          "name_de": "Snacks",
          "icon": "Pretzel",
          "keywords": ["chips", "nuts", "popcorn", "cracker", "jerky", "salzstangen"]
        },
        {
          "id": "GROC.SWEETS",
          "name_en": "Confectionery",
          "name_de": "Süßwaren",
          "icon": "Candy",
          "keywords": ["chocolate", "candy", "bonbons", "gummy", "gum", "mints"]
        },
        {
          "id": "GROC.FROZEN",
          "name_en": "Frozen Foods",
          "name_de": "Tiefkühl",
          "icon": "Snowflake",
          "keywords": ["frozen", "eis", "tiefkühlgemüse", "pizza", "ice cream"]
        },
        {
          "id": "GROC.DELI",
          "name_en": "Ready-to-Eat & Deli",
          "name_de": "Feinkost & Fertig",
          "icon": "Utensils",
          "keywords": ["salad bar", "hot bar", "sandwich", "feinkost", "fertiggericht"]
        },
        {
          "id": "GROC.BEVERAGES_NA",
          "name_en": "Beverages (Non-Alcoholic)",
          "name_de": "Getränke (alkoholfrei)",
          "icon": "GlassWater",
          "keywords": ["water", "soda", "juice", "energy", "tea", "coffee", "mineralwasser", "saft", "limonade"]
        },
        {
          "id": "GROC.SPECIALTY",
          "name_en": "International & Specialty",
          "name_de": "International",
          "icon": "Globe",
          "keywords": ["asian", "mexican", "italian", "sushi", "tacos", "curry"]
        },
        {
          "id": "GROC.BABY",
          "name_en": "Baby",
          "name_de": "Baby",
          "icon": "Baby",
          "keywords": ["diapers", "wipes", "formula", "baby food", "windeln"]
        },
        {
          "id": "GROC.PET",
          "name_en": "Pet Supplies",
          "name_de": "Tierbedarf",
          "icon": "Cat",
          "keywords": ["dog food", "cat food", "litter", "treats", "futter"]
        }
      ]
    },
    {
      "id": "ALCO",
      "code": "ALCO",
      "name_en": "Alcohol",
      "name_de": "Alkohol",
      "icon": "Wine",
      "keywords": ["beer", "wine", "spirits", "bier", "wein", "schnaps", "vodka", "whiskey"]
    },
    {
      "id": "DRUG",
      "code": "DRUG",
      "name_en": "Personal Care",
      "name_de": "Drogerie",
      "icon": "Sparkles",
      "keywords": ["shampoo", "soap", "toothpaste", "deodorant", "seife", "zahnpasta"]
    },
    {
      "id": "PHAR",
      "code": "PHAR",
      "name_en": "Pharmacy",
      "name_de": "Apotheke",
      "icon": "Pill",
      "keywords": ["medicine", "vitamins", "pain", "aspirin", "medikamente", "pflaster"]
    },
    {
      "id": "HOME",
      "code": "HOME",
      "name_en": "Household",
      "name_de": "Haushalt",
      "icon": "Home",
      "keywords": ["cleaning", "paper towels", "trash bags", "reiniger", "küchenrolle"]
    },
    {
      "id": "PETS",
      "code": "PETS",
      "name_en": "Pet Store",
      "name_de": "Tierhandlung",
      "icon": "Dog",
      "keywords": ["pet store", "fressnapf"]
    },
    {
      "id": "MISC",
      "code": "MISC",
      "name_en": "Miscellaneous",
      "name_de": "Sonstiges",
      "icon": "Package",
      "keywords": []
    }
  ]
}
```
