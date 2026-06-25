<script setup lang="ts">
import { h } from 'vue'
import { useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'

import { orderService } from '~/services/order.service'
import { useBidStore } from '~/stores/bid.store'
import type { FreightOrder } from '~/types/order'
import type { Bid } from '~/types/bid'
import {
  getOrderStatusIndex,
  orderStatusFlow,
  orderStatusLabels,
} from '~/constants/order-status'
import { useOrderStore } from '~/stores/order.store'
import { useSocket } from '~/composables/useSocket'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const message = useMessage()
const bidStore = useBidStore()
const orderStore = useOrderStore()

const order = ref<FreightOrder | null>(null)
const loading = ref(false)

const orderId = computed(() => String(route.params.id))

const { connectSocket } = useSocket()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ'
}

const getCarrierName = (bid: Bid) => {
  if (typeof bid.carrierId === 'string') return bid.carrierId
  return bid.carrierId.fullName
}

const getCarrierPhone = (bid: Bid) => {
  if (typeof bid.carrierId === 'string') return ''
  return bid.carrierId.phone
}

const handleAcceptBid = async (bid: Bid) => {
  try {
    await bidStore.acceptBid(bid._id)
    message.success('Đã chọn chành xe vận chuyển')
    await fetchData()
  } catch (error: any) {
    message.error(error?.response?.data?.message || 'Chọn báo giá thất bại')
  }
}

const bidColumns: DataTableColumns<Bid> = [
  {
    title: 'Đối tác',
    key: 'carrier',
    render(row) {
      return getCarrierName(row)
    },
  },
  {
    title: 'SĐT',
    key: 'phone',
    render(row) {
      return getCarrierPhone(row)
    },
  },
  {
    title: 'Giá báo',
    key: 'price',
    render(row) {
      return formatCurrency(row.price)
    },
  },
  {
    title: 'Trạng thái',
    key: 'status',
    render(row) {
      const type = row.status === 'ACCEPTED' ? 'success' : row.status === 'REJECTED' ? 'error' : 'info'
      return h(NTag, { type }, { default: () => row.status })
    },
  },
  {
    title: 'Ghi chú',
    key: 'note',
  },
  {
    title: 'Thao tác',
    key: 'actions',
    render(row) {
      if (order.value?.status !== 'WAITING_BID' || row.status !== 'PENDING') {
        return ''
      }

      return h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          onClick: () => handleAcceptBid(row),
        },
        { default: () => 'Chọn' },
      )
    },
  },
]

const fetchData = async () => {
  loading.value = true

  try {
    order.value = await orderService.getById(orderId.value)
    await bidStore.fetchOrderBids(orderId.value)
    await orderStore.fetchTrackingEvents(orderId.value)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchData()

  const socket = connectSocket()

  socket.emit('join_order_room', orderId.value)

  socket.on('order_status_updated', async (payload) => {
    console.log('Realtime order_status_updated:', payload)
    await fetchData()
})
})
</script>

<template>
  <div class="space-y-4">
    <NCard title="Chi tiết đơn hàng" :loading="loading">
      <template #header-extra>
        <NButton @click="navigateTo('/customer/orders')">
          Quay lại
        </NButton>
      </template>

      <div v-if="order" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NCard size="small" title="Thông tin đơn">
          <p>Mã đơn: <b>{{ order.code }}</b></p>
          <p>Trạng thái: {{ order.status }}</p>
          <p>Dịch vụ: {{ order.serviceType }}</p>
        </NCard>

        <NCard size="small" title="Tuyến vận chuyển">
          <p>Điểm lấy: {{ order.pickupAddress }} - {{ order.pickupProvince }}</p>
          <p>Điểm giao: {{ order.deliveryAddress }} - {{ order.deliveryProvince }}</p>
        </NCard>

        <NCard size="small" title="Người gửi">
          <p>{{ order.senderName }}</p>
          <p>{{ order.senderPhone }}</p>
        </NCard>

        <NCard size="small" title="Người nhận">
          <p>{{ order.receiverName }}</p>
          <p>{{ order.receiverPhone }}</p>
        </NCard>

        <NCard size="small" title="Hàng hóa" class="md:col-span-2">
          <p>Tên hàng: {{ order.itemName }}</p>
          <p>Số kiện: {{ order.quantity }}</p>
          <p>Trọng lượng: {{ order.weightKg }} kg</p>
          <p>Khối: {{ order.volumeM3 || 0 }} m³</p>
          <p>Giá trị: {{ formatCurrency(order.itemValue || 0) }}</p>
          <p>Ghi chú: {{ order.note || '-' }}</p>
        </NCard>
      </div>
    </NCard>

    <NCard v-if="order" title="Tiến trình vận chuyển">
      <NSteps
        :current="getOrderStatusIndex(order.status) + 1"
        :status="order.status === 'CANCELLED' ? 'error' : 'process'"
      >
        <NStep
          v-for="status in orderStatusFlow"
          :key="status"
          :title="orderStatusLabels[status]"
        />
      </NSteps>
    </NCard>

    <NCard title="Lịch sử trạng thái">
        <NTimeline>
          <NTimelineItem
            v-for="event in orderStore.trackingEvents"
            :key="event._id"
            type="info"
            :title="orderStatusLabels[event.status]"
            :content="event.note || event.location || '-'"
            :time="new Date(event.createdAt).toLocaleString('vi-VN')"
          />
        </NTimeline>
      </NCard>

    <NCard title="Danh sách báo giá">
      <NDataTable
        :columns="bidColumns"
        :data="bidStore.orderBids"
        :loading="bidStore.loading"
        :pagination="{ pageSize: 10 }"
      />
    </NCard>
  </div>
</template>