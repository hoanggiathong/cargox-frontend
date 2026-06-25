import { defineStore } from 'pinia'
import { dashboardService } from '~/services/dashboard.service'
import type { AdminDashboardStats } from '~/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const loading = ref(false)

  const adminStats = ref<AdminDashboardStats>({
    totalOrders: 0,
    waitingBidOrders: 0,
    inProgressOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
    totalCarriers: 0,
    totalBids: 0,
  })

  const fetchAdminStats = async () => {
    loading.value = true

    try {
      adminStats.value = await dashboardService.getAdminStats()
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    adminStats,
    fetchAdminStats,
  }
})