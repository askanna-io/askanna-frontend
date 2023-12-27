<template>
  <VAppBar
    color="primary"
    density="compact"
    class="z-20 pr-1 sm:px-2 py-1 sm:py-0"
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

    <template v-if="$vuetify.display.width > '830'">
      <div class="flex gap-2">
        <AskAnnaButton
          color="white"
          variant="text"
          :href="'https://askanna.io'"
        >
          Find out more about AskAnna
        </AskAnnaButton>
        <AskAnnaButton
          color="white"
          :active="false"
          variant="text"
          :to="{ path: '/workspaces' }"
        >Workspaces
        </AskAnnaButton>
        <AskAnnaButton
          color="white"
          :active="false"
          variant="text"
          class="text-white"
          :to="{ path: '/projects' }"
        >Projects
        </AskAnnaButton>
      </div>
    </template>

    <template v-slot:append>
      <div v-if="$vuetify.display.width > '830'">
        <RouterLink
          :to="{ name: 'signin' }"
          class="text-white no-underline"
        >Sign in</RouterLink>
        /
        <RouterLink
          :to="{ name: 'signup' }"
          class="text-white no-underline"
        >Sign up</RouterLink>
      </div>
      <template v-else>
        <VAppBarNavIcon @click.stop="handleOpenMenu" />
      </template>
    </template>
  </VAppBar>

  <VMain
    class="mx-auto max-w-7xl w-full"
    :class="{ 'max-w-full': mobileStore.isFullScreen }"
  >
    <div :class="{ 'pt-1': $vuetify.display.xs }">
      <TheMobilePublicMainMenu
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
import TheMobilePublicMainMenu from './parts/mobile/TheMobilePublicMainMenu.vue'

const token = window.localStorage.getItem('token')

const userStore = useUserStore()
const mobileStore = useMobileStore()
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()

const showAppBarIcon = computed(() => !route.meta?.hideAppBarIcon)

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

const handleChangeSticked = () => (projectStore.menu.sticked = !projectStore.menu.sticked)

onBeforeMount(() => fetchData())
</script>