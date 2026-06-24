<template>
  <ClientOnly>
    <NConfigProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </NNotificationProvider>
      </NMessageProvider>
    </NConfigProvider>
  </ClientOnly>
</template>