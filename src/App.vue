<template>
  <VApp
    v-scroll="handleOnScroll"
    :class="{
      'mobile-view': $vuetify.display.xs,
      'desktop-view': !$vuetify.display.xs
    }"
  >
    <TheAppLayout />
  </VApp>
</template>

<script setup lang="ts">
useAskAnnaTitle()
const mobileStore = useMobileStore()
const generalStore = useGeneralStore()
const projectsStore = useProjectsStore()
const workspacesStore = useWorkspacesStore()
const { isAllowedToView } = useAskAnnaPermission()
const { route, router, routerPush } = useRouterAskAnna()



// check people permission if they has permission to view route
watch(isAllowedToView, isAllowedToViewRoute => {
  if (isAllowedToViewRoute === false) {
    routerPush({ path: '/workspaces' })
  }
})

watch(() => generalStore.routeNotExist, routeNotExist => {
  if (!routeNotExist) return

  if (route.name.includes('run')) {
    routerPush({ name: 'workspace-project-job-run-does-not-exist', params: route.params })
  } else if (route.name.includes('job')) {
    routerPush({ name: 'workspace-project-job-does-not-exist', params: route.params })
  }
  else if (route.name.includes('code')) {
    routerPush({ name: 'workspace-project-code-does-not-exist', params: route.params })
  }
  else if (route.name.includes('project')) {
    routerPush({ name: 'project-does-not-exist', params: route.params })
  }
  else if (route.name.includes('workspace')) {
    routerPush({ name: 'workspace-does-not-exist' })
  }
  generalStore.routeNotExist = false
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

const handleOnScroll = () => (mobileStore.isMenuSticked = window.pageYOffset > 10)
</script>
<style lang="scss">
@import '@/components/highlight/highlight.scss';

// vuetify3
.mobile-view .v-app-bar .v-toolbar__append {
  margin-right: 0px;
}

.askanna-btn-loader {
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


// table start
.askanna-table .v-data-table__empty-wrapper {
  cursor: initial !important;
}

.job-sub-table .v-data-table__wrapper tr th {
  z-index: 1;
}

.theme--light.v-data-table .v-data-footer {
  border: none;
}

.mobile-view .v-data-table .v-data-footer {
  margin-right: 0;

  .v-data-footer__select {
    margin-left: 0;
  }
}

.v-data-table__expanded.v-data-table__expanded__content {
  box-shadow: none !important;
}

.mobile-view {
  .jobs tbody td.text-start {
    padding: 0 8px 0 0 !important;
  }
}

// table end
</style>