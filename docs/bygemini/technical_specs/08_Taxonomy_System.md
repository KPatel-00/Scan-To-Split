# 08. Taxonomy System

This document defines the standardized category codes used for item classification, AI scanning, and analytics.

## 1. Core Concepts
*   **Merchandise Categories (`GROC`, `ALCO`, etc.)**: Standard items purchased.
*   **Special Lines (`TAX`, `DISC`, etc.)**: Financial adjustments, not physical items.
*   **Hierarchical Structure**: Categories can have children (e.g., `GROC` -> `GROC.DAIRY`).

## 2. Merchandise Categories
Defined in `src/lib/taxonomy/types.ts` and `src/lib/taxonomy/data/categories.json`.

| Code | Name (EN) | Name (DE) | Icon |
| :--- | :--- | :--- | :--- |
| `GROC` | Grocery & Food | Lebensmittel | ShoppingCart |
| `ALCO` | Alcoholic Beverages | Alkohol | Wine |
| `TOBA` | Tobacco & Smoking | Tabakwaren | Cigarette |
| `DRUG` | Drugstore / Personal Care | Drogerie | Pill |
| `PHAR` | Health & Pharmacy (OTC) | Apotheke | Stethoscope |
| `HOME` | Household Supplies | Haushalt | Home |
| `PETS` | Pet Supplies | Tierbedarf | Dog |
| `DIYH` | DIY / Hardware | Baumarkt | Hammer |
| `FURN` | Furniture & Home Living | Möbel | Sofa |
| `ELEC` | Consumer Electronics | Elektronik | Smartphone |
| `APPL` | Large Appliances | Haushaltsgeräte | Refrigerator |
| `OFFI` | Office & Stationery | Bürobedarf | Briefcase |
| `BOOK` | Books & Media | Bücher & Medien | Book |
| `TOYS` | Toys, Crafts & Hobbies | Spielwaren | Gamepad |
| `CLTH` | Apparel & Accessories | Kleidung | Shirt |
| `SPOR` | Sports & Outdoors | Sport & Freizeit | Bike |
| `AUTO` | Auto & Mobility | Auto & KFZ | Car |
| `GARD` | Garden, Plants & Flowers | Garten | Flower |
| `REST` | Restaurant & Foodservice | Gastronomie | Utensils |
| `SERV` | In-Store Services | Dienstleistungen | UserCog |
| `TCOM` | Telco & Digital | Telekommunikation | Wifi |
| `GIFT` | Gift Cards & Stored Value | Gutscheine | Gift |
| `POST` | Postage & Lottery | Post & Lotto | Mail |
| `MISC` | Miscellaneous | Sonstiges | HelpCircle |

### Grocery Subcategories
*   `GROC.PRODUCE` (Obst & Gemüse)
*   `GROC.MEAT` (Fleisch & Geflügel)
*   `GROC.SEAFOOD` (Fisch & Meeresfrüchte)
*   `GROC.DAIRY` (Molkerei & Eier)
*   `GROC.BAKERY` (Bäckerei)
*   `GROC.PANTRY` (Vorrat)
*   `GROC.BREAKFAST` (Frühstück)
*   `GROC.SNACKS` (Snacks)
*   `GROC.SWEETS` (Süßwaren)
*   `GROC.FROZEN` (Tiefkühl)
*   `GROC.DELI` (Feinkost & Fertig)
*   `GROC.BEVERAGES_NA` (Getränke alkoholfrei)

## 3. Special Line Logic (`src/lib/taxonomy/specialLines.ts`)
These codes handle financial adjustments and are often excluded from standard splitting logic.

```typescript
export type SpecialLineCategoryCode =
  | 'TAX'       // Tax (VAT/Sales) - usually excluded
  | 'DEPO'      // Deposit (Pfand)
  | 'DEPO_RET'  // Deposit Return (Pfand-Rückgabe)
  | 'DISC'      // Discount / Promotion
  | 'FEES'      // Fees & Surcharges
  | 'SHIP'      // Shipping / Delivery
  | 'TIP'       // Tip / Gratuity
  | 'ROUND'     // Rounding Adjustment
  | 'REFUND'    // Return / Refund
  | 'CASHBK'    // Cashback at Register - excluded
  | 'DONAT'     // Charitable Donation
  | 'PAYMT';    // Payment Method Lines - excluded
```

## 4. Data Structure (`categories.json`)
The taxonomy is driven by a JSON file that defines icons, translations, and keywords for AI matching.

```json
{
  "id": "GROC.DAIRY",
  "name_en": "Dairy & Eggs",
  "name_de": "Molkerei & Eier",
  "icon": "Egg",
  "keywords": ["milk", "cheese", "butter", "joghurt", "sahne", "eier"]
}
```
