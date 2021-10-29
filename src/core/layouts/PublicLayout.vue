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
            <v-btn class="pa-0" :href="'https://askanna.io/'" text color="transparent">
              <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
            </v-btn>
          </div>
          <div class="text-sm-center ml-sm-6 ml-md-0 d-none d-sm-flex">
            <v-flex>
              <v-menu
                v-if="false"
                v-model="menu"
                :close-on-content-click="false"
                :nudge-width="400"
                offset-y
                nudge-bottom="10"
              >
                <template v-slot:activator="{ on }">
                  <v-btn small dark class="white--text" text v-on="on" :to="{ path: '/projects' }">
                    Projects
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
                    <v-alert dense border="left" colored-border color="deep-purple accent-4">
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

              <v-btn tag="a" small text link input-value="1" :href="'https://askanna.io'" class="mx-1 white--text mx-1">
                Find out more about AskAnna
              </v-btn>
            </v-flex>
          </div>
          <div>
            <router-link class="ask-anna-link white--text" :to="{ name: 'signin' }">
              Sign in
            </router-link>
            /
            <router-link class="ask-anna-link white--text" :to="{ name: 'signup' }">
              Sign up
            </router-link>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="a-content">
        <router-view />
      </v-container>
      <the-snack-bar />
      <update-app />
    </v-main>
  </v-app>
</template>

<script>
import '@/core/plugins/intercom.js'

import useTitle from '@/core/composition/useTitle'
import useUserStore from '@/features/user/composition/useUserStore'
import useProjectStore from '@project/composition/useProjectStore'
import UpdateApp from '@/core/components/shared/updateApp/UpdateApp'
import { ref, computed, onUpdated, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'PublicLayout',

  components: { UpdateApp },

  setup(_, context) {
    useTitle(context)
    const userStore = useUserStore()
    const projectStore = useProjectStore()

    const xsOnly = ref(null)

    const showAppBarIcon = computed(() => !context.root.$route.meta?.hideAppBarIcon)

    const onResize = () => {
      xsOnly.value = context.root.$vuetify.breakpoint.xlOnly || context.root.$vuetify.breakpoint.mdAndDown
    }

    const fetchData = async () => {
      await userStore.actions.getGlobalProfile()
    }

    onBeforeMount(() => fetchData())

    onUpdated(() => {
      if (process.env.VUE_APP_INTERCOM === 'on') {
        window.Intercom('update')
      }
    })

    return {
      showAppBarIcon,
      ...projectStore,
      onResize
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
      { text: 'Shared workspaces', icon: '  ' }
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
