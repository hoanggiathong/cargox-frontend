<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'
import { useOrderStore } from '~/stores/order.store'
import type { FreightOrder } from '~/types/order'
import { orderStatusLabels } from '~/constants/order-status'

definePageMeta({
  layout: 'dashboard',
})

const orderStore = useOrderStore()

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
    title: 'Hàng hóa',
    key: 'itemName',
  },
  {
    title: 'Số kiện',
    key: 'quantity',
  },
  {
    title: 'Kg',
    key: 'weightKg',
  },
  {
    title: 'Trạng thái',
    key: 'status',
    render(row) {
      return h(NTag, { type: 'info' }, { default: () => orderStatusLabels[row.status] || row.status })
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
          onClick: () => navigateTo(`/customer/orders/${row._id}`),
        },
        { default: () => 'Chi tiết' },
      )
    },
  },
]

onMounted(() => {
  orderStore.fetchMyOrders()
})
</script>

<template>
  <NCard title="Đơn hàng của tôi">
    <template #header-extra>
      <NButton type="primary" @click="navigateTo('/customer/orders/create')">
        Tạo đơn
      </NButton>
    </template>

    <NDataTable
      :columns="columns"
      :data="orderStore.myOrders"
      :loading="orderStore.loading"
      :pagination="{ pageSize: 10 }"
    />
  </NCard>
</template>