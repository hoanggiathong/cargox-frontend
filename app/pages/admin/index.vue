<script setup lang="ts">
import { useDashboardStore } from '~/stores/dashboard.store'
import { useSocket } from '~/composables/useSocket'

definePageMeta({
  layout: 'dashboard',
})

const dashboardStore = useDashboardStore()
const { connectSocket } = useSocket()

onMounted(async () => {
  await dashboardStore.fetchAdminStats()

  const socket = connectSocket()

  socket.emit('join_admin_room')

  socket.off('order_status_updated_admin')
  socket.on('order_status_updated_admin', async () => {
    await dashboardStore.fetchAdminStats()
  })
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">
      CargoX Admin Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <NCard title="Tổng đơn" :loading="dashboardStore.loading">
        <div class="text-3xl font-bold">
          {{ dashboardStore.adminStats.totalOrders }}
        </div>
      </NCard>

      <NCard title="Chờ báo giá" :loading="dashboardStore.loading">
        <div class="text-3xl font-bold">
          {{ dashboardStore.adminStats.waitingBidOrders }}
        </div>
      </NCard>

      <NCard title="Đang vận chuyển" :loading="dashboardStore.loading">
        <div class="text-3xl font-bold">
          {{ dashboardStore.adminStats.inProgressOrders }}
        </div>
      </NCard>

      <NCard title="Đã giao" :loading="dashboardStore.loading">
        <div class="text-3xl font-bold">
          {{ dashboardStore.adminStats.deliveredOrders }}
        </div>
      </NCard>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NCard title="Khách hàng">
        <div class="text-2xl font-bold">
          {{ dashboardStore.adminStats.totalCustomers }}
        </div>
      </NCard>

      <NCard title="Đối tác vận chuyển">
        <div class="text-2xl font-bold">
          {{ dashboardStore.adminStats.totalCarriers }}
        </div>
      </NCard>

      <NCard title="Tổng báo giá">
        <div class="text-2xl font-bold">
          {{ dashboardStore.adminStats.totalBids }}
        </div>
      </NCard>
    </div>
  </div>
</template>