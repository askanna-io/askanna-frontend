<template>
  <v-app>
    <v-app-bar app clipped-left dark color="primary" dense>
      <v-app-bar-nav-icon v-if="false" @click.stop="mobileMenu = !mobileMenu" class="hidden-sm-and-up" />
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
          <div class="text-sm-center ml-sm-6 ml-md-0 d-none d-sm-flex">
            <v-flex>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-if="workspaces.length <= 1"
                    small
                    dark
                    class="mx-1 white--text"
                    text
                    :to="{ name: 'workspace' }"
                  >
                    Workspace
                  </v-btn>
                  <v-btn v-else small class="mx-1 white--text mx-1" input-value="1" text v-on="on" link tag="a">
                    Workspace
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in workspaces"
                    :key="index"
                    exact
                    @click="handleChangeWorkspace(item)"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>
            <v-flex v-if="isNotBeta">
              <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="400" offset-y nudge-bottom="10">
                <template v-slot:activator="{ on }">
                  <v-btn small dark class="white--text" text v-on="on">
                    Workspaces
                  </v-btn>
                </template>
                <v-row class="pr-2 white">
                  <v-col cols="4">
                    <v-list dense>
                      <v-list-item-group v-model="project" color="primary">
                        <v-list-item v-for="(item, i) in projects" :key="i">
                          <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-col>
                  <v-col cols="8">
                    <v-alert dense border="left" colored-border color="primary">
                      <v-text-field
                        hide-details
                        dense
                        append-icon="fas fa-search"
                        :height="10"
                        label="Search"
                        single-line
                        outlined
                      />
                      <div class="pt-1 subtitle-2">
                        Frequently visited
                      </div>
                      <v-list two-line dense subheader>
                        <v-list-item v-for="item in projectsList" :key="item.title">
                          <v-list-item-avatar>
                            <v-icon :class="[item.iconClass]" v-text="item.icon"></v-icon>
                          </v-list-item-avatar>

                          <v-list-item-content>
                            <v-list-item-title v-text="item.title"></v-list-item-title>
                            <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                          </v-list-item-content>

                          <v-list-item-action>
                            <v-btn icon>
                              <v-icon color="grey lighten-1">fas fa-info-circle</v-icon>
                            </v-btn>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-alert>
                  </v-col>
                </v-row>
              </v-menu>
              <v-menu v-model="menu2" v-resize="onResize" :close-on-content-click="false" :nudge-width="200" offset-x>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" class="d-md-none">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-title>Settings</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="logout">Logout</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>

            <v-flex>
              <v-menu v-model="menu2" :close-on-content-click="false" :nudge-width="200" offset-x>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" class="d-md-none">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-title>Settings</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title @click="logout">Logout</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>
          </div>
          <div class="text-right hidden-sm-and-down">
            <v-btn @click="handleShowHideUploadStatus" icon :color="colorStatus">
              <v-icon>{{ iconStatus }}</v-icon>
            </v-btn>
            <span v-if="isNotBeta">Build version:&nbsp;{{ version }}</span>
            <v-menu transition="slide-y-transition" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>fas fa-user</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item v-if="isNotBeta">
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item>
                <v-list-item :key="'logout'" exact @click="logout">
                  Logout
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-content>
      <v-container class="a-content">
        <router-view />
      </v-container>
      <the-snack-bar />
      <the-upload-status />
      <update-app />
    </v-content>
  </v-app>
</template>

<script>
import useProjectStore from '@project/composition/useProjectStore'
import TheUploadStatus from '@/core/components/uploadStatus/TheUploadStatus'
import useUploadStatus from '@/core/components/uploadStatus/useUploadStatus'

import UpdateApp from '@/core/components/shared/updateApp/UpdateApp'

import { createNamespacedHelpers } from 'vuex'
import { logout } from '@/core/store/actionTypes'
import useTitle from '@/core/composition/useTitle'
import { AUTH_STORE } from '@/core/store/storeTypes'
import { ref, computed, defineComponent } from '@vue/composition-api'
import useAuthStore from '../../features/auth/composition/useAuthStore'
import useWorkspaceStore from '../../features/workspace/composition/useWorkSpaceStore'

const { mapActions } = createNamespacedHelpers(AUTH_STORE)
export default defineComponent({
  name: 'dashboard',

  components: { UpdateApp, TheUploadStatus },

  setup(props, context) {
    useTitle(context)
    const authStore = useAuthStore()
    const projectStore = useProjectStore()
    const uploadStatus = useUploadStatus()
    const workspaceStore = useWorkspaceStore()

    const logout = () => authStore.actions.logout()
    const xsOnly = ref(null)
    const workspaces = computed(() => workspaceStore.workspaces.value.results)
    const workspaceVmodel = computed({
      get: () => {
        return workspaceStore.workspace.value.uuid
      },
      set: uuid => {
        workspaceStore.getWorkspace(uuid)
      }
    })

    const showAppBarIcon = computed(() => context.root.$route.name !== 'workspace')

    const handleChangeWorkspace = ({ short_uuid }) => {
      context.root.$router.push({ path: `/${short_uuid}`, params: { workspace: short_uuid } })
    }

    const onResize = () => {
      xsOnly.value = context.root.$vuetify.breakpoint.xlOnly || context.root.$vuetify.breakpoint.mdAndDown
    }

    const handleShowHideUploadStatus = () => {
      uploadStatus.showHideSnackBar()
    }

    return {
      showAppBarIcon,
      ...projectStore,
      logout,
      onResize,
      workspaces,
      iconStatus: uploadStatus.iconStatus,
      colorStatus: uploadStatus.colorStatus,
      handleShowHideUploadStatus,
      handleChangeWorkspace
    }
  },

  data: () => ({
    mobileMenu: false,
    project: '',
    version: process.env.VERSION,
    menu: false,
    menu2: false,
    items: [{ title: 'Workspace', name: 'workspace', icon: 'mdi-view-dashboard' }],
    projects: [
      { text: 'Your workspaces', icon: 'fas fa-project-diagram' },
      { text: 'Shared workspaces', icon: 'mdi-account' }
    ],
    projectsList: [
      {
        icon: 'mdi-semantic-web',
        iconClass: 'grey lighten-1 white--text',
        title: 'AskAnna startup',
        subtitle: 'AskAnna'
      },
      {
        icon: 'mdi-semantic-web',
        iconClass: 'grey lighten-1 white--text',
        title: 'AskAnna HQ',
        subtitle: 'Andrii Shapovalov'
      },
      {
        icon: 'mdi-semantic-web',
        iconClass: 'grey lighten-1 white--text',
        title: 'AskAnna Sandbox',
        subtitle: 'Andrii Shapovalov'
      }
    ]
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
