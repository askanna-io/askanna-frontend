export default function () {
  const authStore = useAuthStore()
  const { router } = useRouterAskAnna()
  const workspacesStore = useWorkspacesStore()

  const workspaceId = ref('')
  const IsAccountReady = ref(false)

  const loginUser = async ({ username = '', password = '' }) => {
    return await authStore.login({ username, password, redirect: false })
  }

  const getWorkspace = async () => {
    const workspaces = await workspacesStore.getMemberWorkspaces()
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

    if (!authStore.authToken) {
      router.push({ name: 'signin' })

      return
    }
    IsAccountReady.value = await getWorkspace()
  }

  return { IsAccountReady, workspaceId, checkIfWorkspaceIsReady }
}
