import * as naive from 'naive-ui'

export default defineNuxtPlugin((nuxtApp) => {
  Object.entries(naive).forEach(([name, component]) => {
    if (name.startsWith('N')) {
      nuxtApp.vueApp.component(name, component as never)
    }
  })
})