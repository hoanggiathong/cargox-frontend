<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const form = reactive({
  phone: '',
  password: '',
})

const loading = ref(false)

const handleLogin = async () => {
  loading.value = true

  try {
    // TODO: call API login
    console.log('login payload', form)
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