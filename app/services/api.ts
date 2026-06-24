import axios from 'axios'

export const createApiClient = () => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 30000,
  })

  api.interceptors.request.use((requestConfig) => {
    const token = process.client ? localStorage.getItem('accessToken') : null

    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`
    }

    return requestConfig
  })

  return api
}