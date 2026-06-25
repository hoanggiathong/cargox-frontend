import { createApiClient } from './api'
import type { AdminDashboardStats } from '~/types/dashboard'

export const dashboardService = {
  async getAdminStats(): Promise<AdminDashboardStats> {
    const api = createApiClient()
    const response = await api.get<AdminDashboardStats>('/dashboard/admin/stats')
    return response.data
  },
}