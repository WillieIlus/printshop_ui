import { defineStore } from 'pinia'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'

export type SheetSize = 'A5' | 'A4' | 'A3' | 'SRA3' | 'SRA4'
export type PaperType = 'GLOSS' | 'MATTE' | 'BOND' | 'ART'

export interface PaperStock {
  id: number
  sheet_size: SheetSize
  sheet_size_display?: string
  gsm: number
  paper_type: PaperType
  paper_type_display?: string
  width_mm: number
  height_mm: number
  quantity_in_stock: number
  reorder_level: number
  buying_price_per_sheet: string | null
  is_active: boolean
  display_name?: string
  needs_reorder?: boolean
  created_at?: string
  updated_at?: string
}

export interface PaperStockCreateInput {
  sheet_size: SheetSize
  gsm: number
  paper_type: PaperType
  quantity_in_stock?: number
  reorder_level?: number
  buying_price_per_sheet?: string | number | null
  is_active?: boolean
}

export const usePaperStockStore = defineStore('paperStock', {
  state: () => ({
    items: [] as PaperStock[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    lowStockItems: (state) =>
      state.items.filter((p) => p.needs_reorder ?? p.quantity_in_stock <= p.reorder_level),
    activeItems: (state) => state.items.filter((p) => p.is_active !== false),
  },

  actions: {
    async fetchPaperStock(shopSlug: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const response = await $api<PaperStock[] | { results: PaperStock[] }>(API.shopPaperStock(shopSlug))
        this.items = Array.isArray(response) ? response : (response?.results ?? [])
        return this.items
      } catch (err) {
        this.error = parseApiError(err, 'Failed to fetch paper stock')
        this.items = []
        throw err
      } finally {
        this.loading = false
      }
    },

    async createPaperStock(shopSlug: string, data: PaperStockCreateInput) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const payload = {
          sheet_size: data.sheet_size,
          gsm: Number(data.gsm),
          paper_type: data.paper_type,
          quantity_in_stock: data.quantity_in_stock ?? 0,
          reorder_level: data.reorder_level ?? 100,
          buying_price_per_sheet: data.buying_price_per_sheet != null ? String(data.buying_price_per_sheet) : null,
          is_active: data.is_active ?? true,
        }
        const item = await $api<PaperStock>(API.shopPaperStock(shopSlug), {
          method: 'POST',
          body: payload,
        })
        this.items.push(item)
        return { success: true, item }
      } catch (err) {
        const message = parseApiError(err, 'Failed to create paper stock')
        this.error = message
        throw new Error(message)
      } finally {
        this.loading = false
      }
    },

    async updatePaperStock(shopSlug: string, id: number, data: Partial<PaperStockCreateInput>) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const payload: Record<string, unknown> = { ...data }
        if (data.gsm != null) payload.gsm = Number(data.gsm)
        if (data.buying_price_per_sheet != null) payload.buying_price_per_sheet = String(data.buying_price_per_sheet)
        const item = await $api<PaperStock>(API.shopPaperStockDetail(shopSlug, id), {
          method: 'PATCH',
          body: payload,
        })
        const idx = this.items.findIndex((p) => p.id === id)
        if (idx >= 0) this.items[idx] = item
        return { success: true, item }
      } catch (err) {
        const message = parseApiError(err, 'Failed to update paper stock')
        this.error = message
        throw new Error(message)
      } finally {
        this.loading = false
      }
    },

    async deletePaperStock(shopSlug: string, id: number) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await $api(API.shopPaperStockDetail(shopSlug, id), { method: 'DELETE' })
        this.items = this.items.filter((p) => p.id !== id)
        return { success: true }
      } catch (err) {
        this.error = parseApiError(err, 'Failed to delete')
        throw err
      } finally {
        this.loading = false
      }
    },

    async adjustStock(shopSlug: string, id: number, adjustment: number) {
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const item = await $api<PaperStock>(API.shopPaperStockAdjust(shopSlug, id), {
          method: 'POST',
          body: { adjustment },
        })
        const idx = this.items.findIndex((p) => p.id === id)
        if (idx >= 0) this.items[idx] = item
        return { success: true, item }
      } catch (err) {
        const message = parseApiError(err, 'Failed to adjust stock')
        this.error = message
        throw new Error(message)
      }
    },

    clear() {
      this.items = []
      this.error = null
    },
  },
})
