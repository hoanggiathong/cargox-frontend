import { createApiClient } from './api'
import type {
  CreateFreightOrderPayload,
  FreightOrder,
} from '~/types/order'

export const orderService = {
  async create(payload: CreateFreightOrderPayload): Promise<FreightOrder> {
    const api = createApiClient()
    const response = await api.post<FreightOrder>('/orders', payload)
    return response.data
  },

  async getMyOrders(): Promise<FreightOrder[]> {
    const api = createApiClient()
    const response = await api.get<FreightOrder[]>('/orders/my')
    return response.data
  },

  async getMarketplaceOrders(): Promise<FreightOrder[]> {
    const api = createApiClient()
    const response = await api.get<FreightOrder[]>('/orders/marketplace')
    return response.data
  },

  async getById(id: string): Promise<FreightOrder> {
    const api = createApiClient()
    const response = await api.get<FreightOrder>(`/orders/${id}`)
    return response.data
  },

  async getCarrierOrders(): Promise<FreightOrder[]> {
    const api = createApiClient()
    const response = await api.get<FreightOrder[]>('/orders/carrier/my')
    return response.data
  },

  async updateStatus(id: string, status: FreightOrder['status']): Promise<FreightOrder> {
    const api = createApiClient()
    const response = await api.patch<FreightOrder>(`/orders/${id}/status`, {
      status,
    })
    return response.data
  },
}