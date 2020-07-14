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
<<<<<<< src/core/App.vue
.askanna-breadcrumbs a {
  font-size: 14px;
}
.br-a {
  border: 1px solid;
}
.br-t-b {
  border-top: 1px solid;
  border-bottom: 1px solid;
}
.br-color-grey {
  border-color: #e0e0e0 !important;
}
.br-r5 {
  border-radius: 5px !important;
}
.br-r4 {
  border-radius: 4px !important;
}

.br-none {
  border: none !important;
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
.prism-editor-wrapper {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.prism-editor-wrapper code.language-js {
  font-size: 0.875rem !important;
}

.prism-editor-wrapper .prism-editor__line-numbers,
.prism-editor-wrapper .prism-editor__line-number {
  font-size: 0.875rem !important;
  line-height: 21px !important;
}

.cursor--pointer {
  cursor: pointer;
}

.text--capitalize {
  text-transform: capitalize !important;
}
.text-body-1 {
  font-size: 16px !important;
}

.v-chip.v-chip--clickable.btn--hover:hover,
.v-btn.btn--hover:hover {
  color: #6a4580 !important;
  border: 1px solid #6a4580 !important;
  border-color: #6a4580 !important;
}
.btn--hover:hover .v-avatar .v-avatar--left,
.v-btn.btn--hover:hover i::before {
  color: #6a4580 !important;
}

.v-application code {
  color: #6a4580 !important;
  background-color: #eee !important;
}
</style>
