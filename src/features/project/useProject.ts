export default function () {
  const { route } = useRouterAskAnna()
  const projectStore = useProjectStore()

  const projectIdCd = computed(() => route.params.projectId)

  const fetchData = async () => {
    projectStore.resetProjectData()

    const { projectId } = route.params

    await projectStore.getProjectMe(projectId)
    await projectStore.getProject(projectId)
  }

  onBeforeMount(() => {
    fetchData()
  })

  watch(projectIdCd, (projectId, prevId) => {
    if (projectId && projectId !== prevId) {
      fetchData()
    }
  })

  onUnmounted(() => {
    projectStore.resetProjectData()
  })
}
