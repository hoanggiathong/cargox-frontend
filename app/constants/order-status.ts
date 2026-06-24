import type { OrderStatus } from '~/types/order'

export const orderStatusLabels: Record<OrderStatus, string> = {
  CREATED: 'Đã tạo',
  WAITING_BID: 'Chờ báo giá',
  BID_SELECTED: 'Đã chọn chành xe',
  WAITING_PICKUP: 'Chờ lấy hàng',
  PICKED_UP: 'Đã lấy hàng',
  IN_TRANSIT: 'Đang vận chuyển',
  ARRIVED_DESTINATION: 'Đã đến điểm giao',
  OUT_FOR_DELIVERY: 'Đang giao hàng',
  DELIVERED: 'Đã giao thành công',
  CANCELLED: 'Đã hủy',
}

export const orderStatusFlow: OrderStatus[] = [
  'WAITING_BID',
  'BID_SELECTED',
  'WAITING_PICKUP',
  'PICKED_UP',
  'IN_TRANSIT',
  'ARRIVED_DESTINATION',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

export const getOrderStatusIndex = (status: OrderStatus) => {
  return orderStatusFlow.indexOf(status)
}