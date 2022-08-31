<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Description</v-card-title>
    <v-divider />

    <ask-anna-description class="mx-2" preview readonly :description="job.description" />

    <v-divider />
    <job-definition
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
    <job-running v-if="projectRunCreate" />
  </v-card>
</template>

<script setup lang="ts">
import useMoment from '@/core/composition/useMoment'
import { useJobStore } from '@/features/job/useJobStore'
import useCronstrue from '@/core/composition/useCronstrue'
import usePermission from '@/core/composition/usePermission'
import { computed, onBeforeMount } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useProjectStore } from '@/features/project/useProjectStore'

import JobDefinition from '@job/components/overview/JobDefinition.vue'
import JobRunning from '@/features/job/components/overview/JobRunning.vue'
import AskAnnaDescription from '@/core/components/shared/AskAnnaDescription.vue'

const moment = useMoment()
const jobStore = useJobStore()
const cronstrue = useCronstrue()
const permission = usePermission()
const projectStore = useProjectStore()
const { route, router } = useRouterAskAnna()

const { workspaceId, projectId } = route.value.params

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
