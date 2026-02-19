/** Catalog template (public gallery) */
export interface CatalogTemplate {
  id: number
  title: string
  preview_image: string | null
  starting_price?: string | number
  base_price?: string | number
  badges?: string[]
  product_type?: string
  description?: string | null
}
