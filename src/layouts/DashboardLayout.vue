<template>
  <VApp>
    <VAppBar app clipped-left dark color="primary" :dense="!$vuetify.breakpoint.xsOnly">
      <template v-if="!$vuetify.breakpoint.xsOnly">
        <VAppBarNavIcon v-if="showAppBarIcon" @click.stop="handleChangeSticked" />
      </template>

      <div v-else class="pl-9" />

      <AskAnnaContainer fluid class="pl-1">
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
            <AskAnnaButton
              text
              class="pa-0 mt-1"
              color="transparent"
              :to="{ name: 'workspace', params: { ...$route.params } }"
            >
              <img alt="AskAnna logo" src="/assets/logo.svg" class="logo" />
            </AskAnnaButton>
          </div>
          <MainMenu />
          <UserMenu />
        </div>
      </AskAnnaContainer>
      <template v-if="$vuetify.breakpoint.xsOnly">
        <VAppBarNavIcon @click.stop="handleOpenMenu" />
      </template>
    </VAppBar>

    <VMain class="scrollbar">
      <AskAnnaContainer
        class="a-content"
        :class="{ 'px-0 mx-0 pt-1': $vuetify.breakpoint.xsOnly, 'a-content--full': mobileStore.isFullScreen }"
      >
        <MobileMainMenu v-if="mobileStore.isMenuOpen" @onClose="handleOnCloseMobileMenu" />
        <RouterView />
      </AskAnnaContainer>

      <TheSnackBar />
      <TheUpdateApp />
      <TheUploadStatus />
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import MainMenu from './parts/MainMenu.vue'
import UserMenu from './parts/UserMenu.vue'
import MobileMainMenu from './parts/mobile/MobileMainMenu.vue'

const token = window.localStorage.getItem('token')

const userStore = useUserStore()
const { route } = useRouterAskAnna()
const mobileStore = useMobileStore()
const projectStore = useProjectStore()

const showAppBarIcon = computed(() => !route.meta?.hideAppBarIcon)

const handleChangeSticked = () => (projectStore.menu.sticked = !projectStore.menu.sticked)

const fetchData = async () => {
  await userStore.getGlobalProfile()

  if (token) {
    await userStore.getUserProfile()
  }
}
const handleOnCloseMobileMenu = () => (mobileStore.isMenuOpen = false)
const handleOpenMenu = () => {
  mobileStore.isMenuOpen = !mobileStore.isMenuOpen
  mobileStore.isMenuSticked = window.pageYOffset > 1
}

onBeforeMount(() => fetchData())

onUpdated(() => {
  if (import.meta.env.VITE_APP_INTERCOM === 'on') {
    window.Intercom('update')
  }
})
</script>
<style scoped lang="scss">
.logo {
  height: 30px;
}
.logo.--mobile {
  height: 67px;
}
.colored-border {
  border: 1px solid;
}
</style>
