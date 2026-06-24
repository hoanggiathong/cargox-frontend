import type { OrderStatus } from './order'

export interface TrackingEvent {
  _id: string
  orderId: string
  status: OrderStatus
  note?: string
  location?: string
  createdBy:
    | string
    | {
        _id: string
        fullName: string
        phone: string
        role: string
      }
  createdAt: string
  updatedAt: string
}