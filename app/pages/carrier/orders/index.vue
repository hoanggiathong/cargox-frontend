<script setup lang="ts">
import { h } from 'vue'
import { useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag, NSpace } from 'naive-ui'

import { useOrderStore } from '~/stores/order.store'
import type { FreightOrder, OrderStatus } from '~/types/order'
import { orderStatusLabels } from '~/constants/order-status'

definePageMeta({
  layout: 'dashboard',
})

const message = useMessage()
const orderStore = useOrderStore()

const nextStatuses: Partial<Record<OrderStatus, OrderStatus>> = {
  BID_SELECTED: 'WAITING_PICKUP',
  WAITING_PICKUP: 'PICKED_UP',
  PICKED_UP: 'IN_TRANSIT',
  IN_TRANSIT: 'ARRIVED_DESTINATION',
  ARRIVED_DESTINATION: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
}

const nextStatusButtonLabels: Partial<Record<OrderStatus, string>> = {
  BID_SELECTED: 'Xác nhận chờ lấy',
  WAITING_PICKUP: 'Đã lấy hàng',
  PICKED_UP: 'Đang vận chuyển',
  IN_TRANSIT: 'Đã đến điểm giao',
  ARRIVED_DESTINATION: 'Đang giao hàng',
  OUT_FOR_DELIVERY: 'Hoàn thành',
}

const getStatusType = (status: OrderStatus) => {
  if (status === 'DELIVERED') return 'success'
  if (status === 'CANCELLED') return 'error'
  if (status === 'IN_TRANSIT') return 'warning'
  return 'info'
}

const handleUpdateStatus = async (row: FreightOrder) => {
  const nextStatus = nextStatuses[row.status]

  if (!nextStatus) return

  try {
    await orderStore.updateOrderStatus(row._id, {
      status: nextStatus,
      note: orderStatusLabels[nextStatus],
      location: `${row.pickupProvince} → ${row.deliveryProvince}`,
    })
    message.success('Cập nhật trạng thái thành công')
    await orderStore.fetchCarrierOrders()
  } catch (error: any) {
    message.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại')
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
      const nextStatus = nextStatuses[row.status]

      if (!nextStatus) {
        return ''
      }

      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => navigateTo(`/carrier/orders/${row._id}`),
              },
              {
                default: () => 'Chi tiết',
              },
            ),

            nextStatus
              ? h(
                  NButton,
                  {
                    type: 'primary',
                    size: 'small',
                    loading: orderStore.loading,
                    onClick: () => handleUpdateStatus(row),
                  },
                  {
                    default: () => nextStatusButtonLabels[row.status],
                  },
                )
              : null,
          ],
        },
      )
    },
  },
]

onMounted(async () => {
  await orderStore.fetchCarrierOrders()
})
</script>

<template>
  <NCard title="Đơn đã nhận vận chuyển">
    <NDataTable
      :columns="columns"
      :data="orderStore.carrierOrders"
      :loading="orderStore.loading"
      :pagination="{ pageSize: 10 }"
    />
  </NCard>
</template>