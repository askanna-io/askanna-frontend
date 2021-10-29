import useAuthStore from './useAuthStore'
import { ref } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default function () {
  const authStore = useAuthStore()
  const router = useRouterAskAnna()
  const workspaceStore = useWorkspaceStore()

  const workspaceId = ref('')
  const IsAccountReady = ref(false)

  const loginUser = async ({ username = '', password = '' }) => {
    return await authStore.actions.login({ username, password, redirect: false })
  }

  const getWorkspace = async () => {
    await workspaceStore.actions.reset()
    const workspaces = await workspaceStore.actions.getWorkspaces()
    if (workspaces && workspaces.count && workspaces.count > 0) {
      workspaceId.value = workspaces.results[0].short_uuid

      return true
    }

    return false
  }

  const checkIfWorkspaceIsReady = async ({ username = '', password = '' }) => {
    IsAccountReady.value = false
    // first, try to log in the user by token, if not present use username and password
    if (username && password) {
      const user = await loginUser({ username, password })
      if (!user || !user.key) {
        return
      }
    }

    if (!authStore.state.authToken.value) {
      router.push({ name: 'signin' })

      return
    }
    IsAccountReady.value = await getWorkspace()
  }

  return { IsAccountReady, workspaceId, checkIfWorkspaceIsReady }
}
