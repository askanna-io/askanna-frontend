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
