<template>
  <AskAnnaCard
    class="mx-auto"
    flat
  >
    <AskAnnaCardTitle>Description</AskAnnaCardTitle>
    <AskAnnaDivider />

    <AskAnnaDescription
      preview
      readonly
      :description="job.description"
    />

    <AskAnnaDivider />
    <JobDefinition
      v-if="job.suuid"
      :job="job"
      :nextRun="nextRun"
      :schedules="schedules"
      :routeParams="routeParams"
      :to="'workspace-project-code'"
      :packageSuuid="projectStore.project.package.suuid"
      @handleGoToCode="handleGoToCode"
    />
    <AskAnnaDivider v-if="projectRunCreate" />
    <JobRunning v-if="projectRunCreate" />
  </AskAnnaCard>
</template>

<script setup lang="ts">
const dayjs = useDayjs()
const jobStore = useJobStore()
const cronstrue = useCronstrue()
const permission = usePermission()
const projectStore = useProjectStore()
const { route, routerPush } = useRouterAskAnna()

const { workspaceId, projectId } = route.params

const projectRunCreate = computed(() => permission.getFor(permission.labels.projectRunCreate))

const job = computed(() => jobStore.job)
const nextRun = computed(
  () => jobStore.job.schedules && dayjs.nextClosestData(jobStore.job.schedules?.map(s => s.next_run_at))
)
const schedules = computed(() =>
  jobStore.job.schedules?.map(item => ({
    ...item,
    next_run_at: dayjs.dayjs.tz(item.next_run_at, item.cron_timezone).local().format(' Do MMMM YYYY, h:mm a'),
    humanizeFormat: cronstrue.humanizeCron(item.cron_definition),
    isDifferentTimeZone: dayjs.checkIfTimeZoneEq(item.cron_timezone)
  }))
)

const handleGoToCode = () =>
  routerPush({
    name: 'workspace-project-code',
    params: { projectId, workspaceId, packageId: projectStore.project.package.suuid }
  })

const routeParams = computed(() => ({ projectId, workspaceId, packageId: projectStore.project.package.suuid }))
</script>
