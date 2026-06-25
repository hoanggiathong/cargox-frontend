<script setup lang="ts">
import { orderService } from '~/services/order.service'
import type { FreightOrder } from '~/types/order'
import OrderChat from '~/components/chat/OrderChat.vue'
import { orderStatusLabels } from '~/constants/order-status'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const order = ref<FreightOrder | null>(null)
const loading = ref(false)

const orderId = computed(() => String(route.params.id))

const customerId = computed(() => {
  if (!order.value?.customerId) return ''

  if (typeof order.value.customerId === 'string') {
    return order.value.customerId
  }

  return order.value.customerId._id
})

const fetchData = async () => {
  loading.value = true

  try {
    order.value = await orderService.getById(orderId.value)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="space-y-4">
    <NCard title="Chi tiết đơn vận chuyển" :loading="loading">
      <template #header-extra>
        <NButton @click="navigateTo('/carrier/orders')">
          Quay lại
        </NButton>
      </template>

      <div v-if="order" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NCard size="small" title="Thông tin đơn">
          <p>Mã đơn: <b>{{ order.code }}</b></p>
          <p>Trạng thái: {{ orderStatusLabels[order.status] }}</p>
          <p>Dịch vụ: {{ order.serviceType }}</p>
        </NCard>

        <NCard size="small" title="Tuyến">
          <p>{{ order.pickupAddress }} - {{ order.pickupProvince }}</p>
          <p>{{ order.deliveryAddress }} - {{ order.deliveryProvince }}</p>
        </NCard>

        <NCard size="small" title="Người gửi">
          <p>{{ order.senderName }}</p>
          <p>{{ order.senderPhone }}</p>
        </NCard>

        <NCard size="small" title="Người nhận">
          <p>{{ order.receiverName }}</p>
          <p>{{ order.receiverPhone }}</p>
        </NCard>
      </div>
    </NCard>

    <OrderChat
      v-if="order && customerId"
      :order-id="order._id"
      :receiver-id="customerId"
    />
  </div>
</template>