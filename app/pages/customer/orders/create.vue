<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useOrderStore } from '~/stores/order.store'
import type { ServiceType } from '~/types/order'

definePageMeta({
  layout: 'dashboard',
})

const message = useMessage()
const orderStore = useOrderStore()

const form = reactive({
  senderName: '',
  senderPhone: '',
  pickupAddress: '',
  pickupProvince: 'TPHCM',

  receiverName: '',
  receiverPhone: '',
  deliveryAddress: '',
  deliveryProvince: '',

  itemName: '',
  quantity: 1,
  weightKg: 0,
  volumeM3: 0,
  itemValue: 0,

  serviceType: 'LESS_THAN_TRUCKLOAD' as ServiceType,
  note: '',
})

const serviceTypeOptions = [
  {
    label: 'Ghép hàng',
    value: 'LESS_THAN_TRUCKLOAD',
  },
  {
    label: 'Thuê nguyên xe',
    value: 'FULL_TRUCKLOAD',
  },
]

const validateForm = () => {
  if (!form.senderName.trim()) return 'Vui lòng nhập tên người gửi'
  if (!form.senderPhone.trim()) return 'Vui lòng nhập SĐT người gửi'
  if (!form.pickupAddress.trim()) return 'Vui lòng nhập điểm lấy hàng'
  if (!form.pickupProvince.trim()) return 'Vui lòng nhập tỉnh/thành điểm lấy'
  if (!form.receiverName.trim()) return 'Vui lòng nhập tên người nhận'
  if (!form.receiverPhone.trim()) return 'Vui lòng nhập SĐT người nhận'
  if (!form.deliveryAddress.trim()) return 'Vui lòng nhập điểm giao hàng'
  if (!form.deliveryProvince.trim()) return 'Vui lòng nhập tỉnh/thành điểm giao'
  if (!form.itemName.trim()) return 'Vui lòng nhập tên hàng'
  if (form.quantity <= 0) return 'Số kiện phải lớn hơn 0'
  if (form.weightKg < 0) return 'Trọng lượng không hợp lệ'

  return ''
}

const handleSubmit = async () => {
  const errorMessage = validateForm()

  if (errorMessage) {
    message.warning(errorMessage)
    return
  }

  try {
    const order = await orderStore.createOrder({
      ...form,
      images: [],
    })

    message.success(`Tạo đơn thành công: ${order.code}`)
    await navigateTo('/customer/orders')
  } catch {
    message.error('Tạo đơn thất bại')
  }
}
</script>

<template>
  <NCard title="Tạo đơn gửi hàng">
    <NForm :model="form" label-placement="top">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NCard title="Thông tin người gửi" size="small">
          <NFormItem label="Tên người gửi">
            <NInput v-model:value="form.senderName" placeholder="Nhập tên người gửi" />
          </NFormItem>

          <NFormItem label="Số điện thoại">
            <NInput v-model:value="form.senderPhone" placeholder="Nhập SĐT người gửi" />
          </NFormItem>

          <NFormItem label="Địa chỉ lấy hàng">
            <NInput v-model:value="form.pickupAddress" placeholder="VD: Quận 6, TPHCM" />
          </NFormItem>

          <NFormItem label="Tỉnh/Thành điểm lấy">
            <NInput v-model:value="form.pickupProvince" />
          </NFormItem>
        </NCard>

        <NCard title="Thông tin người nhận" size="small">
          <NFormItem label="Tên người nhận">
            <NInput v-model:value="form.receiverName" placeholder="Nhập tên người nhận" />
          </NFormItem>

          <NFormItem label="Số điện thoại">
            <NInput v-model:value="form.receiverPhone" placeholder="Nhập SĐT người nhận" />
          </NFormItem>

          <NFormItem label="Địa chỉ giao hàng">
            <NInput v-model:value="form.deliveryAddress" placeholder="VD: Sa Đéc, Đồng Tháp" />
          </NFormItem>

          <NFormItem label="Tỉnh/Thành điểm giao">
            <NInput v-model:value="form.deliveryProvince" placeholder="VD: Đồng Tháp" />
          </NFormItem>
        </NCard>
      </div>

      <NCard title="Thông tin hàng hóa" size="small" class="mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NFormItem label="Tên hàng">
            <NInput v-model:value="form.itemName" placeholder="VD: Phụ tùng xe máy" />
          </NFormItem>

          <NFormItem label="Số kiện">
            <NInputNumber v-model:value="form.quantity" :min="1" class="w-full" />
          </NFormItem>

          <NFormItem label="Trọng lượng kg">
            <NInputNumber v-model:value="form.weightKg" :min="0" class="w-full" />
          </NFormItem>

          <NFormItem label="Khối m³">
            <NInputNumber v-model:value="form.volumeM3" :min="0" class="w-full" />
          </NFormItem>

          <NFormItem label="Giá trị hàng">
            <NInputNumber v-model:value="form.itemValue" :min="0" class="w-full" />
          </NFormItem>

          <NFormItem label="Loại dịch vụ">
            <NSelect
              v-model:value="form.serviceType"
              :options="serviceTypeOptions"
              class="w-full"
            />
          </NFormItem>
        </div>

        <NFormItem label="Ghi chú">
          <NInput
            v-model:value="form.note"
            type="textarea"
            placeholder="Ghi chú thêm"
          />
        </NFormItem>

        <div class="flex justify-end gap-2">
          <NButton @click="navigateTo('/customer/orders')">
            Hủy
          </NButton>

          <NButton type="primary" :loading="orderStore.loading" @click="handleSubmit">
            Tạo đơn
          </NButton>
        </div>
      </NCard>
    </NForm>
  </NCard>
</template>