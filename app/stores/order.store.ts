import { defineStore } from 'pinia'
import { orderService } from '~/services/order.service'
import type {
  CreateFreightOrderPayload,
  FreightOrder,
} from '~/types/order'
import type { TrackingEvent } from '~/types/tracking'

export const useOrderStore = defineStore('order', () => {
  const myOrders = ref<FreightOrder[]>([])
  const marketplaceOrders = ref<FreightOrder[]>([])
  const loading = ref(false)
  const carrierOrders = ref<FreightOrder[]>([])
  const trackingEvents = ref<TrackingEvent[]>([])

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

  const fetchCarrierOrders = async () => {
    loading.value = true

    try {
      carrierOrders.value = await orderService.getCarrierOrders()
    } finally {
      loading.value = false
    }
  }

  const fetchTrackingEvents = async (id: string) => {
    loading.value = true

    try {
      trackingEvents.value = await orderService.getTrackingEvents(id)
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (
    id: string,
    payload: {
      status: FreightOrder['status']
      note?: string
      location?: string
    },
  ) => {
    loading.value = true

    try {
      return await orderService.updateStatus(id, payload)
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
    carrierOrders,
    fetchCarrierOrders,
    updateOrderStatus,
    trackingEvents,
    fetchTrackingEvents,
  }
})