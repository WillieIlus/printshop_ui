/**
 * API path segments relative to NUXT_PUBLIC_API_BASE (e.g. http://localhost:8000/api).
 * Matches Django REST framework URL names from the backend.
 */
export const API = {
  // Auth (api-auth/)
  auth: {
    login: 'auth/api-auth/login/',
    refresh: 'auth/api-auth/token/refresh/',
    forgotPassword: 'auth/api-auth/password/reset/',
    resetConfirm: 'auth/api-auth/password/reset/confirm/',
  },
  // Users
  users: () => 'users/',
  userMe: () => 'users/me/',
  userDetail: (pk: string | number) => `users/${pk}/`,
  // Profiles
  profiles: () => 'profiles/',
  profileMe: () => 'profiles/me/',
  profileDetail: (pk: string | number) => `profiles/${pk}/`,
  profileSocialLinks: (profileId: number) => `profiles/${profileId}/social-links/`,
  // Social links (global)
  socialLinks: () => 'social-links/',
  socialLinkDetail: (pk: number) => `social-links/${pk}/`,
  // Shops
  shops: () => 'shops/',
  shopsMyShops: () => 'shops/my_shops/',
  shopDetail: (slug: string) => `shops/${slug}/`,
  shopTransferOwnership: (slug: string) => `shops/${slug}/transfer_ownership/`,
  shopMembers: (slug: string) => `shops/${slug}/members/`,
  shopMemberDetail: (slug: string, pk: number) => `shops/${slug}/members/${pk}/`,
  shopHours: (slug: string) => `shops/${slug}/hours/`,
  shopHoursBulk: (slug: string) => `shops/${slug}/hours/bulk/`,
  shopHoursDetail: (slug: string, pk: number) => `shops/${slug}/hours/${pk}/`,
  shopSocialLinks: (slug: string) => `shops/${slug}/social-links/`,
  shopSocialLinkDetail: (slug: string, pk: number) => `shops/${slug}/social-links/${pk}/`,
  shopsNearby: () => 'shops-nearby/',
  // Product templates
  productTemplates: (slug: string) => `shops/${slug}/product-templates/`,
  productTemplateDetail: (slug: string, pk: number) => `shops/${slug}/product-templates/${pk}/`,
  // Quotes
  shopQuotes: (slug: string) => `shops/${slug}/quotes/`,
  shopQuoteDetail: (slug: string, pk: number) => `shops/${slug}/quotes/${pk}/`,
  shopQuoteCalculate: (slug: string, pk: number) => `shops/${slug}/quotes/${pk}/calculate/`,
  shopQuoteUpdateStatus: (slug: string, pk: number) => `shops/${slug}/quotes/${pk}/update-status/`,
  shopQuoteDuplicate: (slug: string, pk: number) => `shops/${slug}/quotes/${pk}/duplicate/`,
  shopQuoteItems: (slug: string, quoteId: number) => `shops/${slug}/quotes/${quoteId}/items/`,
  shopQuoteItemDetail: (slug: string, quoteId: number, pk: number) =>
    `shops/${slug}/quotes/${quoteId}/items/${pk}/`,
  requestQuote: (slug: string) => `shops/${slug}/request-quote/`,
  myQuotes: () => 'my-quotes/',
  // Templates (catalog)
  templates: () => 'templates/',
  // Claims
  claims: () => 'claims/',
  claimDetail: (pk: number) => `claims/${pk}/`,
  claimVerify: () => 'claims/verify/',
  claimReview: (pk: number) => `claims/${pk}/review/`,
  
  // Pricing - Public (no auth required)
  shopRateCard: (slug: string) => `shops/${slug}/rate-card/`,
  shopCalculatePrice: (slug: string) => `shops/${slug}/calculate-price/`,
  
  // Pricing - Management (shop owner)
  shopPrintingPrices: (slug: string) => `shops/${slug}/pricing/printing/`,
  shopPrintingPriceDetail: (slug: string, pk: number) => `shops/${slug}/pricing/printing/${pk}/`,
  shopPaperPrices: (slug: string) => `shops/${slug}/pricing/paper/`,
  shopPaperPriceDetail: (slug: string, pk: number) => `shops/${slug}/pricing/paper/${pk}/`,
  shopFinishingServices: (slug: string) => `shops/${slug}/pricing/finishing/`,
  shopFinishingServiceDetail: (slug: string, pk: number) => `shops/${slug}/pricing/finishing/${pk}/`,
  shopVolumeDiscounts: (slug: string) => `shops/${slug}/pricing/discounts/`,
  shopVolumeDiscountDetail: (slug: string, pk: number) => `shops/${slug}/pricing/discounts/${pk}/`,
  // Inventory (machines, materials, paper stock)
  shopMachines: (slug: string) => `shops/${slug}/machines/`,
  shopMachineDetail: (slug: string, id: number) => `shops/${slug}/machines/${id}/`,
  shopMachineCapabilities: (slug: string, machinePk: number) => `shops/${slug}/machines/${machinePk}/capabilities/`,
  shopMachineCapabilityDetail: (slug: string, machinePk: number, pk: number) =>
    `shops/${slug}/machines/${machinePk}/capabilities/${pk}/`,
  shopMaterials: (slug: string) => `shops/${slug}/materials/`,
  shopMaterialDetail: (slug: string, id: number) => `shops/${slug}/materials/${id}/`,
  shopMaterialStock: (slug: string, materialPk: number) => `shops/${slug}/materials/${materialPk}/stock/`,
  shopMaterialStockDetail: (slug: string, materialPk: number, pk: number) =>
    `shops/${slug}/materials/${materialPk}/stock/${pk}/`,
  shopMaterialStockAdjust: (slug: string, materialPk: number, pk: number) =>
    `shops/${slug}/materials/${materialPk}/stock/${pk}/adjust/`,
  shopPaperStock: (slug: string) => `shops/${slug}/paper-stock/`,
  shopPaperStockDetail: (slug: string, id: number) => `shops/${slug}/paper-stock/${id}/`,
  shopPaperStockAdjust: (slug: string, id: number) => `shops/${slug}/paper-stock/${id}/adjust/`,
  shopPricing: (slug: string) => `shops/${slug}/pricing/`,

  // Subscription & payments
  shopSubscription: (slug: string) => `shops/${slug}/subscription/`,
  shopStkPush: (slug: string) => `shops/${slug}/payments/mpesa/stk-push/`,
  plans: () => 'plans/',
  paymentStatus: (id: number) => `payments/${id}/status/`,
} as const
