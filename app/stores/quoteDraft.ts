import type { QuoteDraft } from '~/services/quoteDraft'
import { getActiveDraft, getDraft, addItem, updateItem, removeItem, requestQuote } from '~/services/quoteDraft'

export const useQuoteDraftStore = defineStore('quoteDraft', () => {
  const activeDraft = ref<QuoteDraft | null>(null)
  const currentShopSlug = ref<string | null>(null)
  const isLoading = ref(false)

  async function loadDraft(shopSlug: string) {
    isLoading.value = true
    try {
      activeDraft.value = await getActiveDraft(shopSlug)
      currentShopSlug.value = shopSlug
      return activeDraft.value
    } finally {
      isLoading.value = false
    }
  }

  async function addToQuote(
    productId: number,
    shopSlug: string,
    pricingMode: 'SHEET' | 'LARGE_FORMAT' = 'SHEET'
  ) {
    let draft = activeDraft.value
    if (!draft || currentShopSlug.value !== shopSlug) {
      draft = await loadDraft(shopSlug)
    }
    if (!draft) return null
    const item = await addItem(draft.id, {
      product: productId,
      quantity: 1,
      pricing_mode: pricingMode,
    })
    if (activeDraft.value?.id === draft.id) {
      activeDraft.value = {
        ...activeDraft.value,
        items: [...(activeDraft.value.items ?? []), item],
      }
    }
    return item
  }

  async function refreshDraft() {
    const draft = activeDraft.value
    if (!draft) return
    try {
      activeDraft.value = await getDraft(draft.id)
    } catch (err) {
      console.error('Failed to refresh draft:', err)
    }
  }

  async function updateItemQty(itemId: number, qty: number) {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'DRAFT') return
    if (qty < 1) return
    await updateItem(draft.id, itemId, { quantity: qty })
    await refreshDraft()
  }

  async function removeItemFromDraft(itemId: number) {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'DRAFT') return
    await removeItem(draft.id, itemId)
    await refreshDraft()
  }

  async function submitDraft() {
    const draft = activeDraft.value
    if (!draft || draft.status !== 'DRAFT') return null
    const updated = await requestQuote(draft.id)
    activeDraft.value = updated
    return updated
  }

  function clearDraft() {
    activeDraft.value = null
    currentShopSlug.value = null
  }

  return {
    activeDraft,
    currentShopSlug,
    isLoading,
    loadDraft,
    addToQuote,
    updateItemQty,
    removeItemFromDraft,
    submitDraft,
    refreshDraft,
    clearDraft,
  }
})
