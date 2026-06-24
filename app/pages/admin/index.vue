<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">
      CargoX Admin Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <NCard title="Tổng đơn">
        <div class="text-3xl font-bold">
          0
        </div>
      </NCard>

      <NCard title="Khách hàng">
        <div class="text-3xl font-bold">
          0
        </div>
      </NCard>

      <NCard title="Đối tác">
        <div class="text-3xl font-bold">
          0
        </div>
      </NCard>

      <NCard title="Doanh thu">
        <div class="text-3xl font-bold">
          0 VNĐ
        </div>
      </NCard>
    </div>
  </div>
</template>