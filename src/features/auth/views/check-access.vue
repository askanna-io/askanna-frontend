<template>
  <AskAnnaLoadingProgress :loading="loading">
    <WorkspaceNotReady v-if="!isReady" />
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const token = window.localStorage.getItem('token')

const userStore = useUserStore()
const { routerPush } = useRouterAskAnna()
const prepareAccount = usePrepareAccount()

const authData = computed(() => {
  return {
    username: userStore.tempAuth.username,
    password: userStore.tempAuth.password
  }
})

const loading = ref(true)
const polling = ref(null)
const isReady = computed(() => prepareAccount.IsAccountReady.value)

const checkWorkspace = async () => {
  await prepareAccount.checkIfWorkspaceIsReady({ ...authData.value })

  if (isReady.value) {
    clearInterval(polling.value)
    userStore.tempAuth = { username: '', password: '' }

    const backAfterUrl = window.localStorage.getItem('back_after_login')
    window.localStorage.setItem('back_after_login', '')

    //check if user need redirect to last visited page
    if (backAfterUrl && backAfterUrl !== '/') {
      routerPush({ path: backAfterUrl, params: { workspaceId: prepareAccount.workspaceId.value } })

      return
    }

    routerPush({ name: 'workspace', params: { workspaceId: prepareAccount.workspaceId.value } })
  }

  loading.value = false
}

const checkReadyCycle = () => {
  polling.value = setInterval(async () => {
    await checkWorkspace()
  }, 5000)
}

const fetchData = async () => {
  await checkWorkspace()
  if (isReady.value) return

  checkReadyCycle()
}

onBeforeMount(() => token && fetchData())

onUnmounted(() => {
  clearInterval(polling.value)
})
</script>
<style scoped>
.join-wrapper {
  height: 100vh;
  background-image: url('/assets/bg/askanna-bg-01.svg');
  background-size: cover;
}
.logo {
  height: 74px;
  margin-bottom: 6px;
}
.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
