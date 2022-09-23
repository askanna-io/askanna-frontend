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
            <v-btn class="pa-0 mt-1" :to="{ path: '/' }" text color="transparent">
              <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
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
      <v-container
        class="a-content"
        :class="{ 'px-0 mx-0 pt-1': $vuetify.breakpoint.xsOnly, 'a-content--full': mobileStore.isFullScreen }"
      >
        <MobilePublicMainMenu v-if="mobileStore.isMenuOpen" @onClose="handleOnCloseMobileMenu" />

        <router-view />
      </v-container>
      <the-snack-bar />
      <UpdateApp />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import MobilePublicMainMenu from './parts/mobile/MobilePublicMainMenu.vue'

useTitle()
const token = window.localStorage.getItem('token')

const userStore = useUserStore()
const mobileStore = useMobileStore()
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()
const projectsStore = useProjectsStore()
const workspacesStore = useWorkspacesStore()

const showAppBarIcon = computed(() => !route.meta?.hideAppBarIcon)

const fetchData = async () => {
  await userStore.getGlobalProfile()

  if (token) {
    await userStore.getUserProfile()
  }
  await projectsStore.getProjects()
  await workspacesStore.getAllWorkspaces()
}

const handleOnCloseMobileMenu = () => (mobileStore.isMenuOpen = false)
const handleOpenMenu = () => {
  mobileStore.isMenuOpen = !mobileStore.isMenuOpen
  mobileStore.isMenuSticked = window.pageYOffset > 1
}

const handleChangeSticked = () => (projectStore.menu.sticked = !projectStore.menu.sticked)

onBeforeMount(() => fetchData())

onUpdated(() => {
  if (import.meta.env.VITE_APP_INTERCOM === 'on') {
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
</style>