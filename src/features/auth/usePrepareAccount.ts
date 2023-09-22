export default function () {
  const authStore = useAuthStore()
  const { routerPush } = useRouterAskAnna()
  const workspacesStore = useWorkspacesStore()

  const workspaceId = ref('')
  const IsAccountReady = ref(false)

  const loginUser = async ({ email = '', password = '' }) => await authStore.login({ email, password })

  const checkMemberWorkspace = async () => {
    await workspacesStore.getMemberWorkspace()

    workspaceId.value = workspacesStore.getMemberWorkspaceSUUID

    return !!workspaceId.value
  }

  const checkIfWorkspaceIsReady = async ({ email = '', password = '' }) => {
    IsAccountReady.value = false
    // first, try to log in the user by token, if not present use email and password
    if (email && password) {
      const user = await loginUser({ email, password })
      if (!user || !user.key) {
        return
      }
    }

    if (!authStore.authToken) {
      routerPush({ name: 'signin' })

      return
    }

    IsAccountReady.value = await checkMemberWorkspace()
  }

  return { IsAccountReady, workspaceId, checkIfWorkspaceIsReady }
}