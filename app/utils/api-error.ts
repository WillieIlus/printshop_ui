/**
 * Extract user-friendly error message from API responses (Django REST, etc.).
 * Handles: { detail: string }, { field: ["msg"] }, plain string, and standard Error.
 */
export function parseApiError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'data' in err) {
    const responseData = (err as { data: unknown }).data

    if (typeof responseData === 'object' && responseData !== null) {
      const obj = responseData as Record<string, unknown>
      if (typeof obj.detail === 'string') return obj.detail
      if (Array.isArray(obj.detail)) return (obj.detail as string[]).join('; ')
      const fieldErrors = Object.entries(obj)
        .filter(([, v]) => Array.isArray(v) || typeof v === 'string')
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as string[]).join(', ') : v}`)
        .join('; ')
      if (fieldErrors) return fieldErrors
    }

    if (typeof responseData === 'string') return responseData
  }

  if (err instanceof Error) return err.message

  return fallback
}
