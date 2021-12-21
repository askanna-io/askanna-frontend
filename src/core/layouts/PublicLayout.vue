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
            <v-btn class="pa-0 mt-1" :href="'https://askanna.io/'" text color="transparent">
              <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
            </v-btn>
          </div>
          <template v-if="$vuetify.breakpoint.width > '830'">
            <div class="text-sm-center ml-sm-6 ml-md-0 d-none d-sm-flex">
              <v-flex>
                <v-btn small text link :href="'https://askanna.io'" class="mx-1 white--text mx-1">
                  Find out more about AskAnna
                </v-btn>
                <v-btn small text dark class="white--text mr-2 askAnna-btn-link" :to="{ path: '/workspaces' }"
                  >Workspaces</v-btn
                >
                <v-btn small text dark class="white--text askAnna-btn-link" :to="{ path: '/projects' }">Projects</v-btn>
              </v-flex>
            </div>
            <div>
              <router-link class="ask-anna-link white--text" :to="{ name: 'signin' }"> Sign in </router-link>
              /
              <router-link class="ask-anna-link white--text" :to="{ name: 'signup' }"> Sign up </router-link>
            </div>
          </template>
        </div>
      </v-container>
      <template v-if="$vuetify.breakpoint.xsOnly">
        <v-app-bar-nav-icon @click.stop="handleOpenMenu" />
      </template>
    </v-app-bar>

    <v-main class="scrollbar">
      <v-container class="a-content" :class="{ 'px-0 mx-0 pt-1': $vuetify.breakpoint.xsOnly }">
        <MobilePublicMainMenu v-if="mobileMenu" @onClose="handleOnCloseMobileMenu" />

        <router-view />
      </v-container>
      <the-snack-bar />
      <update-app />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import '@/core/plugins/intercom.js'
import useTitle from '@/core/composition/useTitle'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useUserStore from '@/features/user/composition/useUserStore'

import { useProjectsStore } from '@/features/projects/useProjectsStore'
import UpdateApp from '@/core/components/shared/updateApp/UpdateApp.vue'
import MobilePublicMainMenu from './parts/mobile/MobilePublicMainMenu.vue'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'
import { ref, computed, onUpdated, onBeforeMount } from '@vue/composition-api'

useTitle()
const token = window.localStorage.getItem('token')

const userStore = useUserStore()
const routerAA = useRouterAskAnna()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const workspacesStore = useWorkspacesStore()

const mobileMenu = ref(false)

const showAppBarIcon = computed(() => !routerAA.route.value.meta?.hideAppBarIcon)

const fetchData = async () => {
  await userStore.actions.getGlobalProfile()

  if (token) {
    await userStore.actions.getUserProfile()
  }
  await projectsStore.getProjects()
  await workspacesStore.getAllWorkspaces()
}

const handleOnCloseMobileMenu = () => (mobileMenu.value = false)
const handleOpenMenu = () => (mobileMenu.value = !mobileMenu.value)
const handleChangeSticked = () => (projectStore.stickedVM.value = !projectStore.stickedVM.value)

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
