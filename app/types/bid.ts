import type { FreightOrder } from './order'

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'

export interface Bid {
  _id: string
  orderId: string | FreightOrder
  carrierId: string | {
    _id: string
    fullName: string
    phone: string
    role: string
  }
  price: number
  estimatedPickupTime?: string
  estimatedDeliveryTime?: string
  note?: string
  status: BidStatus
  createdAt: string
  updatedAt: string
}

export interface CreateBidPayload {
  price: number
  estimatedPickupTime?: string
  estimatedDeliveryTime?: string
  note?: string
}