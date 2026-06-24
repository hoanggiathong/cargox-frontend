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
}