<template>
  <v-app>
    <v-app-bar app clipped-left dark color="primary" dense>
      <v-app-bar-nav-icon v-if="showAppBarIcon" @click.stop="stickedVM = !stickedVM" />
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

<script>
import '@/core/plugins/intercom.js'
import useProjectStore from '@project/composition/useProjectStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

import AskAnnaMainMenu from './parts/AskAnnaMainMenu'
import AskAnnaUserMenu from './parts/AskAnnaUserMenu'

import UpdateApp from '@/core/components/shared/updateApp/UpdateApp'
import TheUploadStatus from '@/core/components/uploadStatus/TheUploadStatus'
import useUploadStatus from '@/core/components/uploadStatus/useUploadStatus'

import useTitle from '@/core/composition/useTitle'
import useUserStore from '@/features/user/composition/useUserStore'
import useAuthStore from '../../features/auth/composition/useAuthStore'
import useWorkspaceStore from '../../features/workspace/composition/useWorkSpaceStore'
import { ref, computed, defineComponent, onBeforeMount, onUpdated } from '@vue/composition-api'

export default defineComponent({
  name: 'PublicAuthLayout',

  components: { UpdateApp, TheUploadStatus, AskAnnaMainMenu, AskAnnaUserMenu },

  setup(_, context) {
    useTitle(context)
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const projectStore = useProjectStore()
    const uploadStatus = useUploadStatus()
    const router = useRouterAskAnna(context)
    const workspaceStore = useWorkspaceStore()

    const xsOnly = ref(null)
    const logout = () => authStore.actions.logout()
    const workspaces = computed(() => workspaceStore.workspaces.value.results)
    const workspaceProfile = computed(() => workspaceStore.state.currentPeople.value)
    const currentRole = computed(() => workspaceStore.state.currentPeople.value.role.code)

    const showAppBarIcon = computed(() => !context.root.$route.meta?.hideAppBarIcon)
    const workspaceShortUuid = computed(() => workspaceStore.workspace.value.short_uuid)

    const profileRoute = computed(() => {
      if (currentRole.value === 'WV') {
        return { name: 'profile' }
      }
      return { name: 'workspace-profile', params: { workspaceId: workspaceShortUuid.value } }
    })

    const handleChangeWorkspace = ({ short_uuid }) => {
      if (workspaceShortUuid.value === short_uuid) return
      router.push({ path: `/${short_uuid}`, params: { workspace: short_uuid } })
    }

    const handleShowHideUploadStatus = () => {
      uploadStatus.showHideSnackBar()
    }

    const fetchData = async () => {
      await userStore.actions.getGlobalProfile()
      await userStore.actions.getUserProfile()
    }

    onBeforeMount(() => fetchData())

    onUpdated(() => {
      if (process.env.VUE_APP_INTERCOM === 'on') {
        window.Intercom('update')
      }
    })

    return {
      profileRoute,
      showAppBarIcon,
      stickedVM: projectStore.stickedVM,
      logout,
      workspaces,
      workspaceProfile,
      iconStatus: uploadStatus.iconStatus,
      colorStatus: uploadStatus.colorStatus,

      handleChangeWorkspace,
      handleShowHideUploadStatus
    }
  },

  data: () => ({
    mobileMenu: false,
    items: [{ title: 'Workspace', name: 'workspace', icon: 'mdi-view-dashboard' }]
  })
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
