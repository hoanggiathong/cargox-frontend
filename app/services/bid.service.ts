import { createApiClient } from './api'
import type { Bid, CreateBidPayload } from '~/types/bid'

export const bidService = {
  async createBid(orderId: string, payload: CreateBidPayload): Promise<Bid> {
    const api = createApiClient()
    const response = await api.post<Bid>(`/orders/${orderId}/bids`, payload)
    return response.data
  },

  async getOrderBids(orderId: string): Promise<Bid[]> {
    const api = createApiClient()
    const response = await api.get<Bid[]>(`/orders/${orderId}/bids`)
    return response.data
  },

  async getMyBids(): Promise<Bid[]> {
    const api = createApiClient()
    const response = await api.get<Bid[]>('/bids/my')
    return response.data
  },

  async acceptBid(bidId: string): Promise<unknown> {
    const api = createApiClient()
    const response = await api.patch(`/bids/${bidId}/accept`)
    return response.data
  },
}