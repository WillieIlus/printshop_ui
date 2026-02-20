/** Template gallery types — backend serializers */

export interface TemplateCategoryDTO {
  id: number
  name: string
  slug: string
  template_count?: number
}

export interface TemplateGsmConstraints {
  /** Minimum GSM allowed (e.g. 250) */
  gsm_min?: number | null
  /** Maximum GSM allowed (e.g. 350) */
  gsm_max?: number | null
}

export interface PrintTemplateListDTO {
  id: number
  slug: string
  title: string
  description?: string
  preview_image: string | null
  dimensions_label?: string
  weight_label?: string
  starting_price: string | number
  is_popular?: boolean
  is_best_value?: boolean
  is_new?: boolean
  badges?: string[]
  category?: { id: number; name: string; slug: string }
  /** GSM constraints for price calculation */
  gsm_min?: number | null
  gsm_max?: number | null
}

export interface TemplateOptionDTO {
  id: number
  name: string
  option_group?: string
  price_modifier?: string | number
}

export interface TemplateFinishingDTO {
  id: number
  name: string
  description?: string
  price?: string | number
  is_mandatory?: boolean
}

export interface GroupedOptionDTO {
  group_name: string
  options: TemplateOptionDTO[]
}

export interface PrintTemplateDetailDTO extends Omit<PrintTemplateListDTO, 'category'> {
  description?: string
  grouped_options: GroupedOptionDTO[]
  mandatory_finishing: TemplateFinishingDTO[]
  optional_finishing: TemplateFinishingDTO[]
  min_quantity?: number
}

export interface TemplatePriceBreakdownItemDTO {
  label: string
  amount: string | number
}

export interface TemplatePriceResponseDTO {
  total: string | number
  breakdown?: TemplatePriceBreakdownItemDTO[]
  currency?: string
}

export interface TemplateCalculatePricePayload {
  quantity: number
  gsm: number
  print_sides: 'SIMPLEX' | 'DUPLEX'
  selected_option_ids?: number[]
  selected_finishing_ids?: number[]
}

/** Format GSM constraint for display, e.g. "250–350gsm" or "Max 200gsm" */
export function formatGsmConstraint(t: { gsm_min?: number | null; gsm_max?: number | null }): string | null {
  const min = t.gsm_min ?? null
  const max = t.gsm_max ?? null
  if (min != null && max != null) return `${min}–${max}gsm`
  if (min != null) return `Min ${min}gsm`
  if (max != null) return `Max ${max}gsm`
  return null
}
