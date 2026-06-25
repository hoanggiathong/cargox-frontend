import { useAuthStore } from '~/stores/auth.store'
import { useNotificationStore } from '~/stores/notification.store'
import { useSocket } from '~/composables/useSocket'

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  const { connectSocket } = useSocket()

  watch(
    () => authStore.user?._id,
    (userId) => {
      if (!userId) return

      const socket = connectSocket()

      socket.emit('join_user_room', userId)

      socket.off('notification')
      socket.on('notification', (payload) => {
        notificationStore.addNotification({
          type: payload?.type || 'INFO',
          title: payload?.title || 'Thông báo',
          message: payload?.message || 'Bạn có thông báo mới',
          orderId: payload?.orderId,
          status: payload?.status,
        })
      })
    },
    { immediate: true },
  )
})