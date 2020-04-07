<template>
  <v-app>
    <v-app-bar app clipped-left dark color="primary">
      <v-app-bar-nav-icon @click.stop="mobileMenu = !mobileMenu" class="hidden-sm-and-up" />
      <v-container fluid>
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
            <img alt="AskAnna logo" src="@/assets/logo.svg" class="logo" />
          </div>
          <div class="text-sm-center ml-sm-6 ml-md-0 d-none d-sm-flex">
            <v-flex>
              <v-btn small dark class=" mx-1 white--text" text :to="{ name: 'workspace' }">
                Workspace
              </v-btn>
              <v-menu v-model="menu2" :close-on-content-click="false" :nudge-width="200" offset-x>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" class="d-md-none ">
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
            <span>Build version:&nbsp;{{ version }}</span>
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
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-content>
      <v-container class="a-content">
        <router-view />
      </v-container>
      <the-snack-bar />
    </v-content>

    <v-footer app>
      <span>&copy; AskAnna 2020</span> <v-spacer /> <span>Build version:&nbsp;{{ version }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { logout } from '@/core/store/actionTypes'
import { AUTH_STORE } from '@/core/store/storeTypes'
import { createComponent } from '@vue/composition-api'
import useTitle from '@/core/composition/useTitle'

const { mapActions } = createNamespacedHelpers(AUTH_STORE)
export default createComponent({
  name: 'dashboard',

  setup(props, context) {
    useTitle(context)
  },

  data: () => ({
    mobileMenu: false,
    version: process.env.VERSION,
    project: '',
    fav: true,
    menu: false,
    menu2: false,
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
    items: [{ title: 'Workspace', name: 'workspace', icon: 'mdi-view-dashboard' }]
  }),

  methods: {
    ...mapActions({
      logout
    })
  }
})
</script>
<style scoped>
.logo {
  height: 57px;
}
.logo.--mobile {
  height: 67px;
}
.a-content {
  max-width: 1248px;
}
</style>
