import { defineStore } from 'pinia'
import { orderService } from '~/services/order.service'
import type {
  CreateFreightOrderPayload,
  FreightOrder,
} from '~/types/order'

export const useOrderStore = defineStore('order', () => {
  const myOrders = ref<FreightOrder[]>([])
  const marketplaceOrders = ref<FreightOrder[]>([])
  const loading = ref(false)

  const createOrder = async (payload: CreateFreightOrderPayload) => {
    loading.value = true

    try {
      return await orderService.create(payload)
    } finally {
      loading.value = false
    }
  }

  const fetchMyOrders = async () => {
    loading.value = true

    try {
      myOrders.value = await orderService.getMyOrders()
    } finally {
      loading.value = false
    }
  }

  const fetchMarketplaceOrders = async () => {
    loading.value = true

    try {
      marketplaceOrders.value = await orderService.getMarketplaceOrders()
    } finally {
      loading.value = false
    }
  }

  return {
    myOrders,
    marketplaceOrders,
    loading,
    createOrder,
    fetchMyOrders,
    fetchMarketplaceOrders,
  }
})