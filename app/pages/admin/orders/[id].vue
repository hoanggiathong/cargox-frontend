<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
</script>

<template>
  <NCard title="Chi tiết đơn hàng">
    ID: {{ route.params.id }}
  </NCard>
</template>