<template>
  <v-app>
    <v-app-bar app clipped-left dark color="primary" :dense="!$vuetify.breakpoint.xsOnly">
      <template v-if="!$vuetify.breakpoint.xsOnly">
        <v-app-bar-nav-icon v-if="showAppBarIcon" @click.stop="handleChangeSticked" />
      </template>

      <div v-else class="pl-9" />

      <v-container fluid class="pl-1">
        <div
          class="d-flex align-center"
          align="center"
          :class="{
            'justify-center': $vuetify.breakpoint.xsOnly,
            'justify-space-between': !$vuetify.breakpoint.xsOnly
          }"
          no-gutters
        >
          <div md="auto" sm="12" text-sm-left>
            <v-btn class="pa-0 mt-1" :to="{ name: 'workspace', params: { ...$route.params } }" text color="transparent">
              <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
            </v-btn>
          </div>
          <AskAnnaMainMenu />
          <AskAnnaUserMenu />
        </div>
      </v-container>
      <template v-if="$vuetify.breakpoint.xsOnly">
        <v-app-bar-nav-icon @click.stop="handleOpenMenu" />
      </template>
    </v-app-bar>

    <v-main class="scrollbar">
      <v-container class="a-content" :class="{ 'px-0 mx-0 pt-1': $vuetify.breakpoint.xsOnly }">
        <MobileMainMenu v-if="mobileStore.isMenuOpen" @onClose="handleOnCloseMobileMenu" />
        <router-view />
      </v-container>
      <the-snack-bar />
      <the-upload-status />
      <update-app />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import '@/core/plugins/intercom.js'
import useTitle from '@/core/composition/useTitle'
import AskAnnaMainMenu from './parts/AskAnnaMainMenu.vue'
import AskAnnaUserMenu from './parts/AskAnnaUserMenu.vue'
import { useMobileStore } from '@/core/store/useMobileStore'
import MobileMainMenu from './parts/mobile/MobileMainMenu.vue'
import TheSnackBar from '@/core/components/snackBar/TheSnackBar.vue'
import UpdateApp from '@/core/components/shared/updateApp/UpdateApp.vue'
import TheUploadStatus from '@/core/components/uploadStatus/TheUploadStatus.vue'

import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useUserStore from '@/features/user/composition/useUserStore'
import { useProjectsStore } from '@/features/projects/useProjectsStore'
import { computed, onBeforeMount, onUpdated } from '@vue/composition-api'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'

const token = window.localStorage.getItem('token')

useTitle()
const userStore = useUserStore()
const router = useRouterAskAnna()
const mobileStore = useMobileStore()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const workspacesStore = useWorkspacesStore()

const showAppBarIcon = computed(() => !router.route.value.meta?.hideAppBarIcon)

const handleChangeSticked = () => (projectStore.stickedVM.value = !projectStore.stickedVM.value)

const fetchData = async () => {
  await userStore.actions.getGlobalProfile()

  if (token) {
    await userStore.actions.getUserProfile()
  }

  await projectsStore.getProjects()
  await workspacesStore.getAllWorkspaces()
  await workspacesStore.getMemberWorkspaces()
}
const handleOnCloseMobileMenu = () => (mobileStore.isMenuOpen = false)
const handleOpenMenu = () => {
  mobileStore.isMenuOpen = !mobileStore.isMenuOpen
  mobileStore.isMenuSticked = window.pageYOffset > 1
}

onBeforeMount(() => fetchData())

onUpdated(() => {
  if (process.env.VUE_APP_INTERCOM === 'on') {
    window.Intercom('update')
  }
})
</script>
<style scoped>
.logo {
  height: 30px;
}
.logo.--mobile {
  height: 67px;
}
.a-content {
  max-width: 1248px;
}
</style>
