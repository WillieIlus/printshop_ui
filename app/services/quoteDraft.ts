import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

export interface QuoteDraftItem {
  id: number
  product: number
  product_name: string
  quantity: number
  pricing_mode: string
  unit_price?: string | null
  line_total?: string | null
}

export interface QuoteDraft {
  id: number
  shop: number
  shop_name: string
  status: string
  items: QuoteDraftItem[]
  totals?: Record<string, string>
}

export async function getActiveDraft(shopSlug: string): Promise<QuoteDraft> {
  const api = useApi()
  return await api<QuoteDraft>(API.quoteDraftsActive(shopSlug))
}

export async function getDraft(draftId: number): Promise<QuoteDraft> {
  const api = useApi()
  return await api<QuoteDraft>(API.quoteRequestDetail(draftId))
}

export async function listQuoteRequests(): Promise<QuoteDraft[]> {
  const api = useApi()
  const data = await api<QuoteDraft[] | { results: QuoteDraft[] }>(API.quoteRequests())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: QuoteDraft[] }).results)) {
    return (data as { results: QuoteDraft[] }).results
  }
  return []
}

export interface AddItemPayload {
  product: number
  quantity: number
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
}

export async function addItem(draftId: number, payload: AddItemPayload): Promise<QuoteDraftItem> {
  const api = useApi()
  return await api<QuoteDraftItem>(API.quoteRequestItems(draftId), {
    method: 'POST',
    body: payload,
  })
}

export async function updateItem(
  draftId: number,
  itemId: number,
  payload: Partial<AddItemPayload>
): Promise<QuoteDraftItem> {
  const api = useApi()
  return await api<QuoteDraftItem>(API.quoteRequestItemDetail(draftId, itemId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function removeItem(draftId: number, itemId: number): Promise<void> {
  const api = useApi()
  await api(API.quoteRequestItemDetail(draftId, itemId), { method: 'DELETE' })
}

export interface PreviewPriceLine {
  label: string
  amount: string
}

export interface PreviewPriceResponse {
  currency: string
  total: string
  lines: PreviewPriceLine[]
  hasNegotiable: boolean
}

export async function previewPrice(draftId: number): Promise<PreviewPriceResponse> {
  const api = useApi()
  return await api<PreviewPriceResponse>(API.quoteDraftPreviewPrice(draftId), {
    method: 'POST',
  })
}

export async function requestQuote(draftId: number): Promise<QuoteDraft> {
  const api = useApi()
  return await api<QuoteDraft>(API.quoteRequestSubmit(draftId), {
    method: 'POST',
  })
}
