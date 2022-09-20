<template>
  <component :is="Layout" />
</template>

<script setup ref lang="ts">
import '@/plugins/intercom.js'
import LogindLayout from './LogindLayout.vue'
import PublicLayout from './PublicLayout.vue'
import DashboardLayout from './DashboardLayout.vue'

const props = defineProps({
  layout: {
    type: [String],
    default: 'dashboard'
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

const Layout = computed(() => {
  const layout = props.layout
  const token = window.localStorage.getItem('token')

  switch (true) {
    case layout === 'dashboard':
      return token ? DashboardLayout : PublicLayout

    case layout === 'login':
      return LogindLayout

    default:
      return PublicLayout
  }
})
</script>
<style lang="scss">
.a-content {
  max-width: 1248px;

  &--full {
    max-width: 100%;
  }
}
</style>
