<template>
  <v-app>
    <v-app-bar app clipped-left dark color="primary" dense>
      <v-app-bar-nav-icon v-if="false" @click.stop="mobileMenu = !mobileMenu" class="hidden-sm-and-up" />
      <v-app-bar-nav-icon v-if="showAppBarIcon" @click.stop="handleChangeSticked" />
      <div v-else class="pl-9" />
      <v-container fluid class="pl-1">
        <div
          class="d-flex justify-space-between justify-sm-center align-center justify-md-space-between"
          justify="space-between"
          align="center"
          no-gutters
        >
          <v-navigation-drawer v-model="mobileMenu" app absolute temporary>
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="/content/avatars/andrii.gif" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>Adnrii Shapovalov</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider />
            <v-btn small exact exact-path dark class="white--text" text :to="{ path: '/projects/' }"> Projects </v-btn>
            <v-list dense>
              <v-list-item v-for="item in items" :key="item.title" link :to="{ name: item.name }">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>

          <div md="auto" sm="12" text-sm-center>
            <v-btn class="pa-0" :to="{ name: 'workspace', params: { ...$route.params } }" text color="transparent">
              <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
            </v-btn>
          </div>
          <AskAnnaMainMenu />
          <AskAnnaUserMenu />
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="a-content">
        <router-view />
      </v-container>
      <the-snack-bar />
      <the-upload-status />
      <update-app />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AskAnnaMainMenu from './parts/AskAnnaMainMenu.vue'
import AskAnnaUserMenu from './parts/AskAnnaUserMenu.vue'
import UpdateApp from '@/core/components/shared/updateApp/UpdateApp.vue'
import TheUploadStatus from '@/core/components/uploadStatus/TheUploadStatus.vue'

import '@/core/plugins/intercom.js'
import useTitle from '@/core/composition/useTitle'

import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useUserStore from '@/features/user/composition/useUserStore'
import { useProjectsStore } from '@/features/projects/useProjectsStore'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'
import { ref, computed, onBeforeMount, onUpdated } from '@vue/composition-api'

const mobileMenu = ref(false)
const token = window.localStorage.getItem('token')
const items = ref([{ title: 'Workspace', name: 'workspace', icon: 'mdi-view-dashboard' }])

useTitle()
const userStore = useUserStore()
const router = useRouterAskAnna()
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
