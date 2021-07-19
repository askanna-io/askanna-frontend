<template>
  <ask-anna-loading-progress :type="'table-row'" :loading="loading">
    <workspace-not-ready v-if="!isReady" />
  </ask-anna-loading-progress>
</template>

<script>
import VueRouter from 'vue-router'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useUserStore from '@/features/user/composition/useUserStore'
import usePrepareAccount from '@/features/auth/composition/usePrepareAccount'
import WorkspaceNotReady from '@/features/workspace/components/WorkspaceNotReady'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'
import { ref, computed, onBeforeMount, onUnmounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'check-access',

  components: {
    WorkspaceNotReady,
    AskAnnaLoadingProgress
  },

  setup(_, context) {
    const userStore = useUserStore()
    const router = useRouterAskAnna(context)

    const prepareAccount = usePrepareAccount(context)

    const authData = computed(() => {
      return {
        username: userStore.state.tempAuth.value.username,
        password: userStore.state.tempAuth.value.password
      }
    })

    const loading = ref(true)
    const polling = ref(null)
    const isReady = computed(() => prepareAccount.IsAccountReady.value)

    const checkWorkspace = async () => {
      await prepareAccount.checkIfWorkspaceIsReady({ ...authData.value })

      if (isReady.value) {
        clearInterval(polling.value)
        userStore.mutations.DELETE_TEMP_AUTH()

        const backAfterUrl = window.localStorage.getItem('back_after_login')
        window.localStorage.setItem('back_after_login', '')

        //check if user need redirect to last visited page

        if (backAfterUrl && backAfterUrl !== '/') {
          router.push({ path: backAfterUrl, params: { workspaceId: prepareAccount.workspaceId.value } })

          return
        }

        router.push({ name: 'workspace', params: { workspaceId: prepareAccount.workspaceId.value } })
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

    onBeforeMount(() => fetchData())

    onUnmounted(() => {
      clearInterval(polling.value)
    })

    return {
      isReady,
      loading
    }
  }
})
</script>
<style scoped>
.join-wrapper {
  height: 100vh;
  background-image: url('~@/assets/bg/askanna-bg-01.svg');
  background-size: cover;
}
.logo {
  height: 74px;
  margin-bottom: 6px;
}
.login-expansion .v-expansion-panel {
}
.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
