<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({
  layout: 'auth',
})

const authStore = useAuthStore()
const message = useMessage()

const form = reactive({
  phone: '',
  password: '',
})

const loading = ref(false)

const redirectByRole = async () => {
  if (authStore.role === 'ADMIN') {
    await navigateTo('/admin')
    return
  }

  if (authStore.role === 'CARRIER' || authStore.role === 'DRIVER') {
    await navigateTo('/carrier')
    return
  }

  await navigateTo('/customer/orders')
}

const handleLogin = async () => {
  if (!form.phone.trim() || !form.password.trim()) {
    message.warning('Vui lòng nhập số điện thoại và mật khẩu')
    return
  }

  loading.value = true

  try {
    await authStore.login({
      phone: form.phone.trim(),
      password: form.password,
    })

    message.success('Đăng nhập thành công')
    await redirectByRole()
  } catch {
    message.error('Số điện thoại hoặc mật khẩu không đúng')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NCard title="Đăng nhập CargoX" bordered class="shadow-sm">
    <NForm :model="form" label-placement="top">
      <NFormItem label="Số điện thoại">
        <NInput v-model:value="form.phone" placeholder="Nhập số điện thoại" />
      </NFormItem>

      <NFormItem label="Mật khẩu">
        <NInput
          v-model:value="form.password"
          type="password"
          show-password-on="click"
          placeholder="Nhập mật khẩu"
          @keyup.enter="handleLogin"
        />
      </NFormItem>

      <NButton type="primary" block :loading="loading" @click="handleLogin">
        Đăng nhập
      </NButton>
    </NForm>
  </NCard>
</template>