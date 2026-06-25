<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import {
  adminMenuOptions,
  carrierMenuOptions,
  customerMenuOptions,
} from '~/constants/menu'
import { useNotificationStore } from '~/stores/notification.store'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const collapsed = ref(false)

const menuOptions = computed(() => {
  if (authStore.role === 'ADMIN') return adminMenuOptions
  if (authStore.role === 'CARRIER' || authStore.role === 'DRIVER') return carrierMenuOptions
  return customerMenuOptions
})

const activeKey = computed(() => route.path)

const notificationStore = useNotificationStore()

const showNotifications = ref(false)

const handleMenuSelect = (key: string) => {
  router.push(key)
}
</script>

<template>
  <NLayout has-sider class="min-h-screen">
    <NLayoutSider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="h-14 flex items-center px-4 font-bold text-lg">
        CargoX
      </div>

      <NMenu
        :value="activeKey"
        :options="menuOptions"
        @update:value="handleMenuSelect"
      />
    </NLayoutSider>

    <NLayout>
      <NLayoutHeader bordered class="h-14 px-4 flex items-center justify-between bg-white">
        <div class="font-semibold">
          Nền tảng vận tải hàng hóa
        </div>
        <NBadge :value="notificationStore.unreadCount" :max="99">
          <NButton size="small" @click="showNotifications = true">
            Thông báo
          </NButton>
        </NBadge>
        <div class="flex items-center gap-3">
          <span>{{ authStore.user?.fullName || 'User' }}</span>
          <NButton size="small" @click="authStore.logout">
            Đăng xuất
          </NButton>
        </div>
      </NLayoutHeader>

      <NLayoutContent class="p-4 bg-slate-100 min-h-[calc(100vh-56px)]">
        <slot />
      </NLayoutContent>
    </NLayout>
  </NLayout>

  <NModal
    v-model:show="showNotifications"
    preset="card"
    title="Thông báo"
    style="width: 520px"
  >
    <div v-if="notificationStore.notifications.length === 0">
      Chưa có thông báo
    </div>

    <div v-else class="space-y-2">
      <NCard
        v-for="item in notificationStore.notifications"
        :key="item.createdAt"
        size="small"
      >
        <div class="font-semibold">
          {{ item.title }}
        </div>
        <div>{{ item.message }}</div>
        <div class="text-xs text-gray-500">
          {{ new Date(item.createdAt).toLocaleString('vi-VN') }}
        </div>
      </NCard>
    </div>
  </NModal>
</template>