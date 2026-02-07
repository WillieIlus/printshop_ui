/**
 * Pricing types for the simplified pricing models.
 */

// Sheet sizes
export type SheetSize = 'A5' | 'A4' | 'A3' | 'SRA3'

// Color modes
export type ColorMode = 'BW' | 'COLOR'

// Paper types
export type PaperType = 'GLOSS' | 'MATTE' | 'BOND' | 'ART'

// Finishing categories
export type FinishingCategory = 'LAMINATION' | 'BINDING' | 'CUTTING' | 'FOLDING' | 'OTHER'

// Charge by options
export type ChargeBy = 'PER_SHEET' | 'PER_PIECE' | 'PER_JOB'

/**
 * Printing price - cost per printed side
 */
export interface PrintingPrice {
  id: number
  machine: number
  sheet_size: SheetSize
  color_mode: ColorMode
  selling_price_per_side: string
  buying_price_per_side: string | null
  profit_per_side: string
  is_active: boolean
}

/**
 * Paper price - cost per sheet by GSM
 */
export interface PaperPrice {
  id: number
  sheet_size: SheetSize
  gsm: number
  paper_type: PaperType
  buying_price: string
  selling_price: string
  profit: string
  margin_percent: string
  is_active: boolean
}

/**
 * Finishing service - lamination, binding, etc.
 */
export interface FinishingService {
  id: number
  name: string
  category: FinishingCategory
  charge_by: ChargeBy
  buying_price: string
  selling_price: string
  profit: string
  is_default: boolean
  is_active: boolean
}

/**
 * Volume discount
 */
export interface VolumeDiscount {
  id: number
  name: string
  min_quantity: number
  discount_percent: string
  is_active: boolean
}

/**
 * Public rate card - what customers see
 */
export interface RateCard {
  printing: PublicPrintingRate[]
  paper: PublicPaperRate[]
  finishing: PublicFinishingRate[]
}

export interface PublicPrintingRate {
  sheet_size: string
  color_mode: string
  price_per_side: string
  price_double_sided: string
}

export interface PublicPaperRate {
  gsm: number
  paper_type: string
  price_per_sheet: string
}

export interface PublicFinishingRate {
  id: number
  name: string
  category: string
  price: string
  charge_by: string
  is_default: boolean
}

/**
 * Price calculation input
 */
export interface PriceCalculationInput {
  sheet_size: SheetSize
  gsm: number
  quantity: number
  sides?: 1 | 2
  paper_type?: PaperType
  finishing_ids?: number[]
}

/**
 * Price calculation result
 */
export interface PriceCalculationResult {
  quantity: number
  sides: number
  printing_price_per_side: string
  paper_price_per_sheet: string
  total_printing: string
  total_paper: string
  total_finishing: string
  finishing_breakdown: FinishingBreakdown[]
  grand_total: string
  price_per_sheet: string
}

export interface FinishingBreakdown {
  name: string
  price: string
  charge_by: string
  total: string
}

/**
 * Form data for creating/editing pricing items
 */
export interface PrintingPriceForm {
  machine: number
  sheet_size: SheetSize
  color_mode: ColorMode
  selling_price_per_side: string
  buying_price_per_side?: string
}

export interface PaperPriceForm {
  sheet_size: SheetSize
  gsm: number
  paper_type: PaperType
  buying_price: string
  selling_price: string
}

export interface FinishingServiceForm {
  name: string
  category: FinishingCategory
  charge_by: ChargeBy
  buying_price?: string
  selling_price: string
  is_default?: boolean
}

export interface VolumeDiscountForm {
  name: string
  min_quantity: number
  discount_percent: string
}
