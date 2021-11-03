import { useRouter } from '@u3u/vue-hooks'
import { computed } from '@vue/composition-api'
import useUserStore from '@/features/user/composition/useUserStore'
import useAuthStore from '@/features/auth/composition/useAuthStore'
import { PERMISSIONS_LABELS } from '@/features/workspace/store/const'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default () => {
  const { route } = useRouter()
  const authStore = useAuthStore()
  const userStore = useUserStore()

  const workspaceStore = useWorkspaceStore()

  const token = computed(() => window.localStorage.getItem('token'))

  const isWorkspaceViewer = computed(
    () =>
      !token.value ||
      !workspaceStore.state.currentPeople.value.role.code ||
      workspaceStore.state.currentPeople.value.role.code === 'WV'
  )

  const isAllowedToView = computed(() => {
    const routePermission =
      workspaceStore.getters.currentPeoplePermission.value &&
      workspaceStore.getters.currentPeoplePermission.value[route.value.meta?.permission]

    return typeof routePermission === 'undefined' || routePermission
  })

  const getFor = (label: string) =>
    workspaceStore.getters.currentPeoplePermission.value
      ? !!workspaceStore.getters.currentPeoplePermission.value[label]
      : false

  return {
    getFor,
    token,
    isAllowedToView,
    isWorkspaceViewer,
    labels: PERMISSIONS_LABELS,
    isUserLoggedIn: !!token.value
  }
}
