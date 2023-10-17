export default function () {
  const { route } = useRouterAskAnna()
  const projectStore = useProjectStore()

  const routeParams = computed(() => route.params)

  const fetchData = async () => {
    projectStore.resetProjectData()

    const { projectId } = route.params

    await projectStore.getProjectMe(projectId)

    if (route?.name?.includes('jobs-job-run')) return
    await projectStore.getProject(projectId)
  }

  onBeforeMount(() => {
    fetchData()
  })

  watch(routeParams, (cr, prev) => {
    if (cr?.projectId && (!projectStore.project.suuid || cr?.projectId !== prev?.projectId)) {
      fetchData()
    }
  })

  onUnmounted(() => {
    projectStore.resetProjectData()
  })
}
