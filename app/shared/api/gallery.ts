import type {
  TemplateCategoryDTO,
  PrintTemplateListDTO,
  PrintTemplateDetailDTO,
  TemplatePriceResponseDTO,
  TemplateCalculatePricePayload,
} from '~/shared/types/templates'
import type { PaginatedResponse } from '~/shared/types'
import { API } from '~/shared/api-paths'

export interface ListShopTemplatesParams {
  category?: string
  search?: string
  ordering?: string
}

export async function listShopCategories(shopSlug: string): Promise<TemplateCategoryDTO[]> {
  const { get } = useApi()
  const data = await get<TemplateCategoryDTO[] | { results: TemplateCategoryDTO[] }>(
    API.shopTemplateCategories(shopSlug)
  )
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: TemplateCategoryDTO[] }).results)) {
    return (data as { results: TemplateCategoryDTO[] }).results
  }
  return []
}

export async function listShopTemplates(
  shopSlug: string,
  params?: ListShopTemplatesParams
): Promise<PaginatedResponse<PrintTemplateListDTO>> {
  const { get } = useApi()
  const query: Record<string, string | number | boolean> = {}
  if (params?.category) query.category = params.category
  if (params?.search) query.search = params.search
  if (params?.ordering) query.ordering = params.ordering

  const response = await get<PaginatedResponse<PrintTemplateListDTO>>(API.shopTemplates(shopSlug), query)
  return {
    count: response?.count ?? 0,
    next: response?.next ?? null,
    previous: response?.previous ?? null,
    results: response?.results ?? [],
  }
}

export async function getShopTemplate(
  shopSlug: string,
  templateSlug: string
): Promise<PrintTemplateDetailDTO | null> {
  const { get } = useApi()
  try {
    return await get<PrintTemplateDetailDTO>(API.shopTemplateDetail(shopSlug, templateSlug))
  } catch {
    return null
  }
}

export async function calculateShopTemplatePrice(
  shopSlug: string,
  templateSlug: string,
  payload: TemplateCalculatePricePayload
): Promise<TemplatePriceResponseDTO | null> {
  const { post } = useApi()
  try {
    return await post<TemplatePriceResponseDTO>(
      API.shopTemplateCalculatePrice(shopSlug, templateSlug),
      payload
    )
  } catch {
    return null
  }
}
