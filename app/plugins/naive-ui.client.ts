import {
  create,
  NButton,
  NCard,
  NConfigProvider,
  NDataTable,
  NDropdown,
  NForm,
  NFormItem,
  NInput,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NMessageProvider,
  NModal,
  NNotificationProvider,
  NSpin,
} from 'naive-ui'

export default defineNuxtPlugin((nuxtApp) => {
  const naive = create({
    components: [
      NButton,
      NCard,
      NConfigProvider,
      NDataTable,
      NDropdown,
      NForm,
      NFormItem,
      NInput,
      NLayout,
      NLayoutContent,
      NLayoutHeader,
      NLayoutSider,
      NMenu,
      NMessageProvider,
      NModal,
      NNotificationProvider,
      NSpin,
    ],
  })

  nuxtApp.vueApp.use(naive)
})