<template>
  <div
    :class="{ 'mobile-view': $vuetify.breakpoint.xsOnly, 'desktop-view': !$vuetify.breakpoint.xsOnly }"
    v-scroll="handleOnScroll">
    <Layout :layout="layout" :isLoggedIn="userStore.isLoggedIn" />
  </div>
</template>

<script setup lang="ts">
import { get } from 'lodash'
import Layout from './layouts/Layout.vue'
import { routerConfig } from './router/routerConfig'

useTitle()
const userStore = useUserStore()
const mobileStore = useMobileStore()
const projectsStore = useProjectsStore()
const { isAllowedToView } = usePermission()
const workspacesStore = useWorkspacesStore()
const { route, router, routerPush } = useRouterAskAnna()

// check people permission if they has permission to view route
watch(isAllowedToView, isAllowedToViewRoute => {
  if (isAllowedToViewRoute === false) {
    routerPush({ path: '/workspaces' })
  }
})

// reset menu state
router.afterEach(() => {
  mobileStore.isMenuOpen = false
  workspacesStore.menu.isOpen = false
  workspacesStore.menu.query.search = null
  workspacesStore.menu.workspaces.results = []

  projectsStore.menu.isOpen = false
  projectsStore.menu.query.search = null
  projectsStore.menu.projects.results = []
})

const layout = computed(() => {
  const name = route.name || 'signin'

  // get layout from routerConfig else use default
  return get(routerConfig, `${name}.layout`) || 'dashboard'
})

const handleOnScroll = () => (mobileStore.isMenuSticked = window.pageYOffset > 10)
</script>
<style lang="scss">
@import '@/components/highlight/highlight.scss';

#app .row {
  margin-top: 0;
  margin-bottom: 0;
}

.overflow-x-overlay {
  overflow-x: overlay;
}

.theme--light.v-card>.v-card__subtitle,
.theme--light.v-card>.v-card__text .v-window {
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

.v-application .list ul {
  padding-left: 0;
}

.v-application--is-ltr .v-data-table--fixed-header.askanna-table .v-data-footer {
  margin-right: 0 !important;
}

.w-100p {
  width: 100%;
}

.ml-4-1 {
  margin-left: 18px;
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

.v-application .ask-anna--editor code {
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

.sticky-fox {
  position: fixed !important;
  top: 58px !important;
  bottom: auto !important;
  left: 0px !important;
  width: 543px !important;
  z-index: 10 !important;
}

// mobile view
.mobile-view {
  .v-dialog {
    margin: 12px;
  }

  .v-toolbar__extension {
    padding: 4px 12px;
  }

  .v-item-group.v-slide-group {
    display: grid;
  }

  .AskAnna-app-bar {
    .v-toolbar__content {
      padding-right: 0px;
    }
  }

  .askAnna-breadcrumbs {
    width: 100%;
    height: 20px;
    overflow: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .v-breadcrumbs__divider {
      padding: 0 6px;
    }

    .v-breadcrumbs {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 15px;
      margin-bottom: 15px;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }

      li:nth-child(even):not(.v-breadcrumbs__divider) {
        padding: 0;
      }
    }
  }

  .v-data-table.ask-anna-table .v-data-footer {
    margin-right: 0;

    .v-data-footer__select {
      margin-left: 0;

      .v-select {
        margin: 13px 0 13px 20px;
      }
    }

    .v-data-footer__pagination {
      margin: 0 16px 0 16px;
    }
  }

  .with-tabs .v-toolbar__content {
    padding: 0 0 0 0;
  }

  .v-toolbar__content {
    padding: 4px 8px;
  }

  .askAnna-main-menu {
    width: 580px;
    font-size: 16px !important;

    .table-link,
    .v-list-item__title,
    .v-text-field__slot .v-label,
    .v-text-field__slot input {
      font-size: 16px !important;
    }

    .v-data-table__wrapper td {
      padding-left: 12px !important;
    }

    .v-alert__border {
      border-width: 2px !important;
    }

    .v-skeleton-loader__heading {
      width: 100%;
      margin-bottom: 10px;
    }

    .v-btn--plain.v-btn--active:not(.v-btn--loading):not(:focus):not(:hover) .v-btn__content {
      opacity: 0.62;
    }
  }
}

.v-application .theme--light.v-btn-toggle:not(.v-btn-toggle--group) .v-btn.v-btn {
  border-color: #515151 !important;
}

.v-item-group.v-btn-toggle .btn--hover:not(:first-child):hover {
  border-left: none !important;
}

.text-body-2 .v-breadcrumbs__item--disabled {
  color: rgba(0, 0, 0, 0.87) !important;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.0178571429em !important;
}
</style>
