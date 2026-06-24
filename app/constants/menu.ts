import type { MenuOption } from 'naive-ui'

export const adminMenuOptions: MenuOption[] = [
  { label: 'Dashboard', key: '/admin' },
  { label: 'Đơn hàng', key: '/admin/orders' },
  { label: 'Đối tác vận chuyển', key: '/admin/carriers' },
  { label: 'Khách hàng', key: '/admin/customers' },
]

export const customerMenuOptions: MenuOption[] = [
  { label: 'Đơn hàng của tôi', key: '/customer/orders' },
  { label: 'Tạo đơn', key: '/customer/orders/create' },
]

export const carrierMenuOptions: MenuOption[] = [
  { label: 'Dashboard', key: '/carrier' },
  { label: 'Marketplace', key: '/carrier/marketplace' },
  { label: 'Đơn đã nhận', key: '/carrier/orders' },
  { label: 'Hồ sơ chành xe', key: '/carrier/profile' },
]