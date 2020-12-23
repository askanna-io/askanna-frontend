import useAuthStore from './useAuthStore'
import { ref, SetupContext } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default function (context: SetupContext) {
  const authStore = useAuthStore()
  const workspaceStore = useWorkspaceStore()

  const IsAccountReady = ref(false)
  const workspaceId = ref('')

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

    // await authStore.actions.logout(false)
    return false
  }

  const checkIfWorkspaceIsReady = async ({ username = '', password = '' }) => {
    IsAccountReady.value = false
    // first, try to log in the user by token, if not present use username and password
    if (username && password) {
      const user = await loginUser({ username, password })
      if (!user || !user.key) {
        // context.root.$router.push({ name: 'signin' })

        return
      }
    }

    if (!authStore.state.authToken.value) {
      context.root.$router.push({ name: 'signin' })

      return
    }
    IsAccountReady.value = await getWorkspace()
  }

  return { IsAccountReady, workspaceId, checkIfWorkspaceIsReady }
}
