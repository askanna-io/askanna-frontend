<template>
  <v-app>
    <component :is="layout" />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { routerConfig, RouterConfig } from './router/routerConfig'

@Component
export default class App extends Vue {
  get config() {
    const name: string = this.$route.name || 'login'
    // get layout from routerConfig else use default
    return (
      ({}.hasOwnProperty.call(routerConfig, name) && routerConfig[name]) || {
        layout: 'dashboard'
      }
    )
  }

  get layout() {
    const layout = this.config.layout
    return () => import(`./layouts/${layout}.vue`)
  }
}
</script>
<style>
.br-r5 {
  border-radius: 5px !important;
}

.scrollbar {
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

.scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3) !important;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3) !important;
  background-color: #f5f5f5 !important;
}

.scrollbar::-webkit-scrollbar {
  width: 4px !important;
  background-color: #f5f5f5 !important;
}

.scrollbar::-webkit-scrollbar-thumb {
  background-color: #6a4580 !important;
  border: 2px solid #555555 !important;
}
</style>
