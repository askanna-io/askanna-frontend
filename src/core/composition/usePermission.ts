import { useRouter } from '@/core/plugins/vue-hooks'
import { computed } from '@vue/composition-api'
import { PERMISSIONS_LABELS } from '@/features/workspace/const'
import { usePeopleStore } from '@/features/people/usePeopleStore'

export default () => {
  const { route } = useRouter()
  const peopleStore = usePeopleStore()

  const token = computed(() => window.localStorage.getItem('token'))

  const isWorkspaceViewer = computed(
    () => !token.value || !peopleStore.currentPeople.role.code || peopleStore.currentPeople.role.code === 'WV'
  )

  const isAllowedToView = computed(() => {
    const routePermission =
      peopleStore.currentPeoplePermission && peopleStore.currentPeoplePermission[route.value.meta?.permission]

    return typeof routePermission === 'undefined' || routePermission
  })

  // @TODO ref to use lodash get
  const getFor = (label: string) =>
    peopleStore.currentPeoplePermission ? !!peopleStore.currentPeoplePermission[label] : false

  return {
    getFor,
    token,
    isAllowedToView,
    isWorkspaceViewer,
    labels: PERMISSIONS_LABELS,
    isUserLoggedIn: !!token.value
  }
}
