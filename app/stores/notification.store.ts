import { defineStore } from 'pinia'

export interface AppNotification {
  type: string
  title: string
  message: string
  orderId?: string
  status?: string
  createdAt: string
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<AppNotification[]>([])

  const addNotification = (payload: Omit<AppNotification, 'createdAt'>) => {
    notifications.value.unshift({
      ...payload,
      createdAt: new Date().toISOString(),
    })
  }

  const unreadCount = computed(() => notifications.value.length)

  return {
    notifications,
    unreadCount,
    addNotification,
  }
})