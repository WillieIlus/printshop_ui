export function useApi() {
  const config = useRuntimeConfig()

  async function get<T>(url: string, params?: Record<string, string | number>): Promise<T> {
    const { $api } = useNuxtApp()
    return $api(url, { params }) as Promise<T>
  }

  async function post<T>(url: string, body?: Record<string, unknown> | FormData | null): Promise<T> {
    const { $api } = useNuxtApp()
    return $api(url, { method: 'POST', body }) as Promise<T>
  }

  async function put<T>(url: string, body?: Record<string, unknown> | FormData | null): Promise<T> {
    const { $api } = useNuxtApp()
    return $api(url, { method: 'PUT', body }) as Promise<T>
  }

  async function patch<T>(url: string, body?: Record<string, unknown> | FormData | null): Promise<T> {
    const { $api } = useNuxtApp()
    return $api(url, { method: 'PATCH', body }) as Promise<T>
  }

  async function del<T>(url: string): Promise<T> {
    const { $api } = useNuxtApp()
    return $api(url, { method: 'DELETE' }) as Promise<T>
  }

  function getMediaUrl(path: string | null): string | null {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${config.public.mediaBase as string}/${path}`
  }

  return {
    get,
    post,
    put,
    patch,
    del,
    getMediaUrl,
  }
}
