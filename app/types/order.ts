export type ServiceType = 'LESS_THAN_TRUCKLOAD' | 'FULL_TRUCKLOAD'

export type OrderStatus =
  | 'CREATED'
  | 'WAITING_BID'
  | 'BID_SELECTED'
  | 'WAITING_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'

export interface FreightOrder {
  _id: string
  code: string
  customerId: string

  senderName: string
  senderPhone: string
  pickupAddress: string
  pickupProvince: string

  receiverName: string
  receiverPhone: string
  deliveryAddress: string
  deliveryProvince: string

  itemName: string
  quantity: number
  weightKg: number
  volumeM3?: number
  itemValue?: number

  serviceType: ServiceType
  status: OrderStatus
  note?: string
  images: string[]

  createdAt: string
  updatedAt: string
}

export interface CreateFreightOrderPayload {
  senderName: string
  senderPhone: string
  pickupAddress: string
  pickupProvince: string

  receiverName: string
  receiverPhone: string
  deliveryAddress: string
  deliveryProvince: string

  itemName: string
  quantity: number
  weightKg: number
  volumeM3?: number
  itemValue?: number

  serviceType: ServiceType
  note?: string
  images?: string[]
}