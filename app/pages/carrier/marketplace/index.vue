<script setup lang="ts">
import { h } from 'vue'
import { useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag } from 'naive-ui'

import { useOrderStore } from '~/stores/order.store'
import { useBidStore } from '~/stores/bid.store'
import type { FreightOrder } from '~/types/order'

definePageMeta({
  layout: 'dashboard',
})

const message = useMessage()
const orderStore = useOrderStore()
const bidStore = useBidStore()

const showBidModal = ref(false)
const selectedOrder = ref<FreightOrder | null>(null)

const bidForm = reactive({
  price: 0,
  estimatedPickupTime: '',
  estimatedDeliveryTime: '',
  note: '',
})

const openBidModal = (order: FreightOrder) => {
  selectedOrder.value = order
  bidForm.price = 0
  bidForm.estimatedPickupTime = ''
  bidForm.estimatedDeliveryTime = ''
  bidForm.note = ''
  showBidModal.value = true
}

const handleCreateBid = async () => {
  if (!selectedOrder.value) return

  if (bidForm.price <= 0) {
    message.warning('Vui lòng nhập giá báo hợp lệ')
    return
  }

  try {
    await bidStore.createBid(selectedOrder.value._id, {
      price: bidForm.price,
      estimatedPickupTime: bidForm.estimatedPickupTime || undefined,
      estimatedDeliveryTime: bidForm.estimatedDeliveryTime || undefined,
      note: bidForm.note || undefined,
    })

    message.success('Báo giá thành công')
    showBidModal.value = false
    await orderStore.fetchMarketplaceOrders()
  } catch (error: any) {
    message.error(error?.response?.data?.message || 'Báo giá thất bại')
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
      return h(NTag, { type: 'info' }, { default: () => row.status })
    },
  },
  {
    title: 'Thao tác',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          onClick: () => openBidModal(row),
        },
        {
          default: () => 'Báo giá',
        },
      )
    },
  },
]

onMounted(async () => {
  await orderStore.fetchMarketplaceOrders()
})
</script>

<template>
  <NCard title="Marketplace hàng hóa">
    <NDataTable
      :columns="columns"
      :data="orderStore.marketplaceOrders"
      :loading="orderStore.loading"
      :pagination="{ pageSize: 10 }"
    />

    <NModal
      v-model:show="showBidModal"
      preset="card"
      title="Báo giá vận chuyển"
      style="width: 520px"
    >
      <div v-if="selectedOrder" class="space-y-3">
        <NCard size="small" title="Thông tin đơn">
          <div>Mã đơn: <b>{{ selectedOrder.code }}</b></div>
          <div>Tuyến: {{ selectedOrder.pickupProvince }} → {{ selectedOrder.deliveryProvince }}</div>
          <div>Hàng hóa: {{ selectedOrder.itemName }}</div>
          <div>Trọng lượng: {{ selectedOrder.weightKg }} kg</div>
        </NCard>

        <NForm :model="bidForm" label-placement="top">
          <NFormItem label="Giá báo">
            <NInputNumber
              v-model:value="bidForm.price"
              :min="0"
              class="w-full"
              placeholder="Nhập giá vận chuyển"
            />
          </NFormItem>

          <NFormItem label="Thời gian lấy hàng dự kiến">
            <NInput
              v-model:value="bidForm.estimatedPickupTime"
              placeholder="VD: 2026-06-24T15:00:00"
            />
          </NFormItem>

          <NFormItem label="Thời gian giao dự kiến">
            <NInput
              v-model:value="bidForm.estimatedDeliveryTime"
              placeholder="VD: 2026-06-25T10:00:00"
            />
          </NFormItem>

          <NFormItem label="Ghi chú">
            <NInput
              v-model:value="bidForm.note"
              type="textarea"
              placeholder="Ghi chú cho khách hàng"
            />
          </NFormItem>

          <div class="flex justify-end gap-2">
            <NButton @click="showBidModal = false">
              Hủy
            </NButton>

            <NButton
              type="primary"
              :loading="bidStore.loading"
              @click="handleCreateBid"
            >
              Gửi báo giá
            </NButton>
          </div>
        </NForm>
      </div>
    </NModal>
  </NCard>
</template>