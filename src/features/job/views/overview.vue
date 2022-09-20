<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Description</v-card-title>
    <v-divider />

    <AskAnnaDescription class="mx-2" preview readonly :description="job.description" />

    <v-divider />
    <JobDefinition
      v-if="job.short_uuid"
      :job="job"
      :nextRun="nextRun"
      :schedules="schedules"
      :routeParams="routeParams"
      :to="'workspace-project-code'"
      :lastPackage="projectStore.lastPackage"
      @handleGoToCode="handleGoToCode"
    />
    <v-divider v-if="projectRunCreate" />
    <JobRunning v-if="projectRunCreate" />
  </v-card>
</template>

<script setup lang="ts">
const moment = useMoment()
const jobStore = useJobStore()
const cronstrue = useCronstrue()
const permission = usePermission()
const projectStore = useProjectStore()
const { route, router } = useRouterAskAnna()

const { workspaceId, projectId } = route.params

const projectRunCreate = computed(() => permission.getFor(permission.labels.projectRunCreate))

const job = computed(() => jobStore.job)
const nextRun = computed(() => moment.nextClosestData(jobStore.job.schedules.map(s => s.next_run)))
const schedules = computed(() =>
  jobStore.job.schedules.map(item => ({
    ...item,
    next_run: moment.$moment.tz(item.next_run, item.cron_timezone).local().format(' Do MMMM YYYY, h:mm a'),
    humanizeFormat: cronstrue.humanizeCron(item.cron_definition),
    isDifferentTimeZone: moment.checkIfTimeZoneEq(item.cron_timezone)
  }))
)

const handleGoToCode = () =>
  router.push({
    name: 'workspace-project-code',
    params: { projectId, workspaceId, packageId: projectStore.lastPackage.short_uuid }
  })

const routeParams = computed(() => ({ projectId, workspaceId, packageId: projectStore.lastPackage.short_uuid }))

const fetchData = async () => {
  await projectStore.getLastPackage(projectId)
}

onBeforeMount(() => {
  fetchData()
})
</script>
