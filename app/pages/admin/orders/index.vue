<script setup lang="ts">
import { h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'

import { useOrderStore } from '~/stores/order.store'
import type { FreightOrder } from '~/types/order'
import { orderStatusLabels } from '~/constants/order-status'
import { useSocket } from '~/composables/useSocket'

definePageMeta({
  layout: 'dashboard',
})

const orderStore = useOrderStore()
const { connectSocket } = useSocket()

const getStatusType = (status: FreightOrder['status']) => {
  switch (status) {
    case 'DELIVERED':
      return 'success'
    case 'CANCELLED':
      return 'error'
    case 'IN_TRANSIT':
    case 'OUT_FOR_DELIVERY':
      return 'warning'
    default:
      return 'info'
  }
}

const columns: DataTableColumns<FreightOrder> = [
  {
    title: 'Mã đơn',
    key: 'code',
  },
  {
    title: 'Tuyến',
    key: 'route',
    render(row) {
      return `${row.pickupProvince} → ${row.deliveryProvince}`
    },
  },
  {
    title: 'Người gửi',
    key: 'sender',
    render(row) {
      return `${row.senderName} - ${row.senderPhone}`
    },
  },
  {
    title: 'Người nhận',
    key: 'receiver',
    render(row) {
      return `${row.receiverName} - ${row.receiverPhone}`
    },
  },
  {
    title: 'Hàng hóa',
    key: 'itemName',
  },
  {
    title: 'Kg',
    key: 'weightKg',
  },
  {
    title: 'Trạng thái',
    key: 'status',
    render(row) {
      return h(
        NTag,
        {
          type: getStatusType(row.status),
        },
        {
          default: () => orderStatusLabels[row.status],
        },
      )
    },
  },
  {
    title: 'Thao tác',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          onClick: () => navigateTo(`/admin/orders/${row._id}`),
        },
        {
          default: () => 'Chi tiết',
        },
      )
    },
  },
]

onMounted(async () => {
  await orderStore.fetchAllOrders()

  const socket = connectSocket()
  socket.emit('join_admin_room')
  socket.off('order_status_updated_admin')
  socket.on('order_status_updated_admin', async () => {
    await orderStore.fetchAllOrders()
  })
})
</script>

<template>
  <NCard title="Quản lý tất cả đơn hàng">
    <NDataTable
      :columns="columns"
      :data="orderStore.allOrders"
      :loading="orderStore.loading"
      :pagination="{ pageSize: 10 }"
    />
  </NCard>
</template>