export function useNotification() {
  const toast = useToast()
  return {
    success(message: string, title = 'Success') {
      toast.add({
        title,
        description: message,
        color: 'success',
        icon: 'i-lucide-check-circle',
        timeout: 5000,
      })
    },
    error(message: string, title = 'Error') {
      toast.add({
        title,
        description: message,
        color: 'error',
        icon: 'i-lucide-alert-circle',
        timeout: 8000,
      })
    },
    warning(message: string, title = 'Warning') {
      toast.add({
        title,
        description: message,
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
        timeout: 5000,
      })
    },
    info(message: string, title = 'Info') {
      toast.add({
        title,
        description: message,
        color: 'info',
        icon: 'i-lucide-info',
        timeout: 5000,
      })
    },
  }
}
