
<template>
  <Component :is="layout" />
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const authStore = useAuthStore()

const layouts = {
  TheDashboardLayout: defineAsyncComponent(() =>
    import('./TheDashboardLayout.vue')
  ),
  ThePublicLayout: defineAsyncComponent(() =>
    import('./ThePublicLayout.vue')
  ),
  TheLoginLayout: defineAsyncComponent(() =>
    import('./TheLoginLayout.vue')
  )
}
const layout = shallowRef()

watch(
  () => route.meta,
  async meta => {
    let layoutName = meta?.layout || 'ThePublicLayout'

    layoutName = authStore.authToken && layoutName === 'ThePublicLayout' ? 'TheDashboardLayout' : layoutName

    layout.value = layouts[layoutName] || layouts.TheDashboardLayout
  }
)

</script>