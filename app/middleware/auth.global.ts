import { useAuthStore } from '~/stores/auth.store'

const PUBLIC_ROUTES = ['/auth/login']

export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC_ROUTES.includes(to.path)) {
    return
  }

  const authStore = useAuthStore()

  if (!authStore.initialized) {
    await authStore.fetchMe()
  }

  if (!authStore.isLoggedIn) {
    return navigateTo('/auth/login')
  }
})