<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Description</v-card-title>
    <v-divider />

    <ask-anna-description class="mx-2" preview readonly :description="job.description" />

    <v-divider />
    <job-definition
      :job="job"
      :nextRun="nextRun"
      :schedules="schedules"
      :lastPackage="lastPackage"
      @handleGoToCode="handleGoToCode"
    />
    <v-divider />

    <job-running />
  </v-card>
</template>

<script>
import useMoment from '@/core/composition/useMoment'
import useJobStore from '@job/composition/useJobStore'
import useCronstrue from '@/core/composition/useCronstrue'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import JobDefinition from '@job/components/overview/JobDefinition'
import JobRunning from '@/features/job/components/overview/JobRunning'
import useProjectStore from '@/features/project/composition/useProjectStore'

import { onBeforeMount, defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  components: {
    JobRunning,
    JobDefinition
  },

  setup(props, context) {
    const cronstrue = useCronstrue()
    const moment = useMoment(context)

    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()

    const projectStore = useProjectStore()
    const { jobId, workspaceId, projectId } = context.root.$route.params

    onBeforeMount(async () => {
      await jobStore.resetStore()
      await jobRunStore.resetStore()
      await jobStore.getJob(jobId)
      await projectStore.getLastPackage(projectId)
    })

    const job = computed(() => jobStore.job.value)
    const nextRun = computed(() => moment.nextClosestData(job.value.schedules.map(s => s.next_run)))
    const schedules = computed(() =>
      job.value.schedules.map(item => ({
        ...item,
        next_run: moment.$moment.tz(item.next_run, item.cron_timezone).local().format(' Do MMMM YYYY, h:mm a'),
        humanizeFormat: cronstrue.humanizeCron(item.cron_definition),
        isDifferentTimeZone: moment.checkIfTimeZoneEq(item.cron_timezone)
      }))
    )

    const handleGoToCode = () =>
      context.root.$router.push({
        name: 'workspace-project-package',
        params: { projectId, workspaceId, packageId: projectStore.lastPackage.value.short_uuid }
      })

    return {
      ...jobStore,
      job,
      nextRun,
      schedules,
      lastPackage: projectStore.lastPackage,
      handleGoToCode
    }
  }
})
</script>
