<template>
  <v-app>
    <Layout :layout="layout" :isLoggedIn="isLoggedIn" />
  </v-app>
</template>

<script lang="ts">
import { get } from 'lodash'

import Layout from '@/core/layouts/Layout'
import { routerConfig } from './router/routerConfig'
import { computed, defineComponent } from '@vue/composition-api'
import useUserStore from '@/features/user/composition/useUserStore'

export default defineComponent({
  name: 'App',

  components: { Layout },

  setup(_, context) {
    const userStore = useUserStore()

    const layout = computed(() => {
      const name = context.root.$route.name || 'signin'

      // get layout from routerConfig else use default
      return get(routerConfig, `${name}.layout`) || 'dashboard'
    })

    const isLoggedIn = computed(() => !!userStore.state.globalProfile.value.short_uuid)

    return { layout, isLoggedIn }
  }
})
</script>
<style lang="scss">
#app .row {
  margin-top: 0;
  margin-bottom: 0;
}
.theme--light.v-card > .v-card__subtitle,
.theme--light.v-card > .v-card__text .v-window {
  color: rgba(0, 0, 0, 0.87) !important;
}
.ask-anna-btn-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.v-application--is-ltr .v-data-table--fixed-header.askanna-table .v-data-footer {
  margin-right: 0 !important;
}
.w-min-110 {
  min-width: 110px !important;
}

.w-min-210 {
  min-width: 210px !important;
}
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

.AskAnna-box-shadow {
  &--none {
    box-shadow: unset !important;
  }
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
  background-color: #5d3eb2 !important;
  border: 2px solid #555555 !important;
}
.cursor--pointer {
  cursor: pointer;
}
.hover-text:hover {
  color: #5d3eb2 !important;
}

.text--capitalize {
  text-transform: capitalize !important;
}

.text--lowercase {
  text-transform: lowercase !important;
}

.text-body-1 {
  font-size: 16px !important;
}

.v-application .primary-text--hover:not([disabled]):hover {
  color: var(--v-primary-base) !important;
  caret-color: var(--v-primary-base) !important;
}

.v-application .white-text--hover:not([disabled]):hover {
  color: #ffffff !important;
  caret-color: #ffffff !important;
}

.v-chip.v-chip--clickable.btn--without-text.btn--hover:hover,
.v-btn.btn--without-text.btn--hover:hover {
  color: #5d3eb2 !important;
  border: none !important;
}
.v-chip.v-chip--clickable.btn--hover:hover,
.v-btn.btn--hover:hover {
  color: #5d3eb2 !important;
  border: 1px solid #5d3eb2 !important;
  border-color: #5d3eb2 !important;
}
.btn--hover:hover .v-avatar .v-avatar--left,
.v-btn.btn--hover:hover i::before {
  color: #5d3eb2 !important;
}

.primary--hover:hover {
  color: #5d3eb2 !important;
}

.v-application code,
.v-application kbd {
  font-weight: 700 !important;
}

.v-application .ProseMirror code {
  padding-left: 0;
}
.v-application code.language-js,
.v-application code.shell,
code.lang-shell {
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  color: #ccc !important;
  background-color: unset !important;
}

.border--primary {
  box-sizing: border-box;
  border: 1px solid #5d3eb2 !important;
  border-color: #5d3eb2 !important;
}

.ask-anna-copy-text code {
  color: #ffffff !important;
}

.img--rounded {
  border-radius: 50% !important;
}

.ask-anna-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.ask-anna-table {
  &--with-links {
    .table-link {
      &--unformated {
        text-decoration: none;
        display: block;
        color: inherit;
      }
    }
  }
}
.AskAnna-app-bar {
  .v-toolbar__content {
    padding-left: 0px;
    padding-right: 3px;
  }
}

.AskAnna-card {
  &--in-dialog {
    .v-card__text {
      font-size: 16px;
    }
  }
}

.AskAnna-text {
  &--initial,
  &--initial .v-btn__content {
    text-transform: initial;
  }
}

.opacity-1 {
  opacity: 1 !important;
}

.text-transform--initial {
  text-transform: initial !important;
}
.v-input--is-label-active .v-input--selection-controls__ripple:before {
  opacity: 0.12 !important;
}
.v-input--selection-controls__ripple:before {
  opacity: 0.04 !important;
}

.askAnna-avatar-badge .v-badge__badge {
  z-index: 1;
}

.askAnna-btn-link.theme--dark.v-btn--active:before,
.askAnna-btn-link.theme--dark.v-btn--active:hover:before {
  opacity: 0;
}

//colors
.primary--black-text {
  color: #000000de !important;
}
</style>
