<template>
  <AskAnnaLoadingProgress :loading="loading">
    <WorkspaceNotReady v-if="!isReady" />
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const token = window.localStorage.getItem('token')

const userStore = useUserStore()
const peopleStore = usePeopleStore()

const { routerPush } = useRouterAskAnna()
const prepareAccount = usePrepareAccount()

const authData = computed(() => {
  return {
    email: userStore.tempAuth.email,
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
    userStore.tempAuth = { email: '', password: '' }

    const backAfterUrl = window.localStorage.getItem('back_after_login')
    window.localStorage.setItem('back_after_login', '')

    await peopleStore.$reset()
    await peopleStore.getCurrentPeople({ workspaceId: prepareAccount.workspaceId.value })

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
