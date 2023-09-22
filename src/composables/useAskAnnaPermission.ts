import { PERMISSIONS_LABELS } from '@/features/workspace/types'

export default () => {
  const { route } = useRouterAskAnna()
  const peopleStore = usePeopleStore()

  const token = computed(() => window.localStorage.getItem('token'))

  const isWorkspaceViewer = computed(
    () => !token.value || !peopleStore.currentPeople.role.code || peopleStore.currentPeople.role.code === 'WV'
  )

  const isAllowedToView = computed(() => {
    const routePermission =
      peopleStore.currentPeoplePermission && peopleStore.currentPeoplePermission[route.meta?.permission]

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
