<template>
  <ask-anna-loading-progress :type="'table-row'" :loading="loading">
    <workspace-not-ready v-if="!isReady" />
  </ask-anna-loading-progress>
</template>

<script>
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

import { ref, computed, onBeforeMount, onUnmounted, defineComponent } from '@vue/composition-api'
import usePrepareAccount from '@/features/auth/composition/usePrepareAccount'
import WorkspaceNotReady from '@/features/workspace/components/WorkspaceNotReady'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  name: 'check-access',

  components: {
    WorkspaceNotReady,
    AskAnnaLoadingProgress
  },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()
    const prepareAccount = usePrepareAccount(context)
    const authData = computed(() => {
      return {
        username: workspaceStore.currentPeople.value.username,
        password: workspaceStore.currentPeople.value.password
      }
    })

    const loading = ref(true)
    const polling = ref(null)
    const isReady = computed(() => prepareAccount.IsAccountReady.value)

    const checkWorkspace = async () => {
      await prepareAccount.checkIfWorkspaceIsReady({ ...authData.value })

      if (isReady.value) {
        clearInterval(polling.value)
        context.root.$router.push({ name: 'workspace', params: { workspaceId: prepareAccount.workspaceId.value } })
      }
      loading.value = false
    }

    const checkReadyCycle = () => {
      polling.value = setInterval(async () => {
        await checkWorkspace()
      }, 5000)
    }

    onBeforeMount(async () => {
      await checkWorkspace()
      if (isReady.value) return

      checkReadyCycle()
    })

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
