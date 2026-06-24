<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import {
  adminMenuOptions,
  carrierMenuOptions,
  customerMenuOptions,
} from '~/constants/menu'

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
</template>