<template>
  <v-app>
    <v-navigation-drawer dark floating app clipped v-model="drawer">
      <v-list dense nav class="py-0">
        <v-list-item two-line :class="miniVariant && 'px-0'">
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/men/81.jpg" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Application</v-list-item-title>
            <v-list-item-subtitle>Subtext</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

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

    <v-app-bar app dense clipped-left dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <img alt="AskAnna logo" src="@/assets/logo.png" class="logo" />
      <v-container class="fill-height flex-sm-nowrap" fluid>
        <v-btn small dark class=" mx-1 white--text" text :to="{ name: 'workspace' }">
          Workspace
        </v-btn>
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="400" offset-y nudge-bottom="10">
          <template v-slot:activator="{ on }">
            <v-btn small dark class="white--text" text v-on="on" :to="{ path: '/' }">
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
        <v-btn small dark class="ml-1 white--text" text :to="{ name: 'jobs' }">
          Jobs
        </v-btn>
        <v-spacer />
        <v-menu transition="slide-y-transition">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>fas fa-user</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title @click="logout">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
      <the-snack-bar />
    </v-content>

    <v-footer app>
      <span>&copy; AskAnna 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { logout } from '@/core/store/actionTypes'
import { AUTH_STORE } from '@/core/store/storeTypes'

const { mapActions } = createNamespacedHelpers(AUTH_STORE)
export default {
  name: 'dashboard',

  data: () => ({
    project: '',
    fav: true,
    menu: false,
    message: false,
    hints: true,
    drawer: false,
    miniVariant: false,
    projectsList: [
      { icon: 'far fa-folder', iconClass: 'grey lighten-1 white--text', title: 'uiprototype', subtitle: 'AskAnna' },
      {
        icon: 'far fa-folder',
        iconClass: 'grey lighten-1 white--text',
        title: 'askanna-frontend',
        subtitle: 'AskAnna'
      },
      {
        icon: 'far fa-folder',
        iconClass: 'grey lighten-1 white--text',
        title: 'Git Lab Issue Reporter',
        subtitle: ' Andrii Shapovalov'
      }
    ],
    projects: [
      { text: 'Your projects', icon: 'fas fa-project-diagram' },
      { text: 'Shared projects', icon: 'mdi-account' },
      { text: 'Conversions', icon: 'mdi-flag' }
    ],
    items: [
      { title: 'Workspace', name: 'workspace', icon: 'mdi-view-dashboard' },
      { title: 'Projects', name: 'projects', icon: 'mdi-image' }
    ]
  }),

  methods: {
    ...mapActions({
      logout
    })
  }
}
</script>
<style scoped>
.logo {
  height: 27px;
}
</style>
