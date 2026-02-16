# Quote UX Redesign — Implementation Plan

## Phase 0 — Audit & Map ✅

### Quote/Estimate Creation Flow
| Route | Purpose | Components | Stores | Price Calculation |
|-------|---------|------------|--------|-------------------|
| `/shops/[slug]` | Public shop page | PriceCalculatorWidget, RateCardDisplay | shop, pricing | `pricingStore.calculatePrice()` → API `shops/{slug}/calculate-price/` |
| `/shops/[slug]/request-quote` | Customer quote request | QuoteForm (customer info only) | shop, quote | None — backend creates request |
| `/dashboard/shops/[slug]/quotes/create` | Shop owner create quote | QuoteForm (customer info only) | quote | None — creates empty quote |
| `/dashboard/shops/[slug]/quotes/[id]` | Quote detail | QuoteCalculator, QuoteItemList | quote | `quoteStore.calculateQuote()` → API (requires existing quote) |

### Key Finding
- **PriceCalculatorWidget** lives on the PUBLIC shop page — has job specs (paper, gsm, quantity, sides, finishing) and calls `calculatePrice`.
- **Quote creation** (both flows) collects only customer info — NO pricing inputs.
- **Disconnect**: Shop owners cannot create a priced quote in one flow. They must create quote → add items separately.

### PriceCalculationResult (from API)
- `total_printing`, `total_paper`, `total_finishing`, `grand_total`, `price_per_sheet`
- `finishing_breakdown[]` — no explicit cost/profit split; backend returns selling prices.

### Current UX Issues
1. **No profit/margin visibility** — only "Total" shown; no cost breakdown vs selling price.
2. **Quote creation has no pricing** — shop owner creates quote with customer info only.
3. **Two separate flows** — calculator on shop page vs quote create in dashboard.
4. **No underpricing warning** — user can't override price; no risk signal.
5. **No cost breakdown** — API returns selling prices; buying costs may exist in backend but not exposed.

---

## Phase 1 — Business Output Panel (Checkpoint 1.1–1.3)

### Checkpoint 1.1: Create QuoteOutputPanel component
- New component: `app/components/quotes/QuoteOutputPanel.vue`
- Props: `pricing` (PriceCalculationResult | null), `overridePrice` (string | null), `loading`
- Emits: `update:overridePrice`
- Shows: Suggested Selling Price, Total Cost (from breakdown), Profit, Margin, Quote Time hint
- Cost breakdown table: Paper, Printing, Finishing, Wastage (0 if N/A), Machine (0 if N/A), Other

### Checkpoint 1.2: Create CostBreakdownTable component
- Reusable table with rows: label, amount, "(not configured)" for zeros

### Checkpoint 1.3: Integrate into PriceCalculatorWidget
- Add QuoteOutputPanel to the right column (replace/enhance current "Price Breakdown")
- Compute profit: if backend provides buying costs, use them; else estimate from margin or show "—"
- Add override price input; show underpricing warning when override < suggested

---

## Phase 2 — Fast Quote Workflow (Checkpoint 2.1–2.2)

### Checkpoint 2.1: Copy as WhatsApp
- Add "Copy as WhatsApp" button to output panel
- Format: job spec, quantity, suggested price, validity, contact

### Checkpoint 2.2: Save Quote + Export PDF
- "Save Quote" → create quote with customer + pricing data (if API supports)
- "Export PDF" → open print-friendly route, `window.print()`

---

## Phase 3 — Language & KES (Checkpoint 3.1)

### Checkpoint 3.1: Replace labels, KES formatting
- "Suggested Selling Price", "Your Profit", "Cost Breakdown", "Underpricing Risk"
- `formatCurrency(value, 'KES')` — add KES to formatters, use consistently

---

## Phase 4 — IA Improvements (Checkpoint 4.1–4.2)

### Checkpoint 4.1: Unified quote creation page for shop owners
- New/refactored: `/dashboard/shops/[slug]/quotes/create` with job specs + customer + output panel
- Collapsible sections: Paper, Print, Finishing, Customer

### Checkpoint 4.2: Sticky output panel
- Desktop: sticky sidebar
- Mobile: sticky bottom bar or collapsible summary

---

## Execution Order
1. Phase 0 ✅ (this doc)
2. Phase 1.1 — QuoteOutputPanel
3. Phase 1.2 — CostBreakdownTable
4. Phase 1.3 — Integrate into PriceCalculatorWidget
5. Phase 3.1 — KES + labels (do early for consistency)
6. Phase 2.1 — Copy WhatsApp
7. Phase 2.2 — Save + PDF
8. Phase 4.1 — Unified create page
9. Phase 4.2 — Sticky panel
