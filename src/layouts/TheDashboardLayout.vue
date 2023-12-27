<template>
  <VAppBar
    color="primary"
    density="compact"
    class="z-20 pr-1 sm:px-2 justify-between py-1 sm:py-0"
  >
    <template v-slot:prepend>
      <template v-if="!$vuetify.display.xs">
        <VAppBarNavIcon
          v-if="showAppBarIcon"
          @click.stop="handleChangeSticked"
        />
      </template>

      <AskAnnaLogo v-if="!$vuetify.display.xs" />
    </template>

    <AskAnnaLogo
      v-if="$vuetify.display.xs"
      class="ml-10"
    />
    <div class="flex gap-2">
      <TheMainMenu />
    </div>

    <template v-slot:append>
      <TheUserMenu />

      <VAppBarNavIcon
        v-if="$vuetify.display.xs"
        @click.stop="handleOpenMenu"
      />
    </template>
  </VAppBar>

  <VMain
    class="mx-auto max-w-7xl w-full"
    :class="{ 'max-w-full': mobileStore.isFullScreen }"
  >
    <div :class="{ 'pt-1': $vuetify.display.xs, }">
      <TheMobileMainMenu
        v-if="mobileStore.isMenuOpen"
        @onClose="handleOnCloseMobileMenu"
      />

      <RouterView />
    </div>

    <TheSnackBar />
    <TheUploadStatus />
  </VMain>
</template>

<script setup lang="ts">
import TheMainMenu from './parts/TheMainMenu.vue'
import TheUserMenu from './parts/TheUserMenu.vue'
import TheMobileMainMenu from './parts/mobile/TheMobileMainMenu.vue'

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
</script>