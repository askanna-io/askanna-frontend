<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Description</v-card-title>
    <v-divider />
    <job-description
      :description="job.description"
      @onSave="handleOnJobSave"
      @onChangeDescription="handleChangeDescription"
    />
    <v-divider />
    <job-definition :job="job" :lastPackage="lastPackage" @handleGoToCode="handleGoToCode" />
    <v-divider />

    <job-running />
  </v-card>
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import JobDefinition from '@job/components/overview/JobDefinition'
import JobDescription from '@job/components/overview/JobDescription'
import JobRunning from '@/features/job/components/overview/JobRunning'
import useProjectStore from '@/features/project/composition/useProjectStore'

import { onBeforeMount, defineComponent, onBeforeDestroy } from '@vue/composition-api'

export default defineComponent({
  components: {
    JobRunning,
    JobDefinition,
    JobDescription
  },

  setup(rops, context) {
    const jobStore = useJobStore()
    const projectStore = useProjectStore()
    const { jobId, workspaceId, projectId } = context.root.$route.params

    onBeforeMount(() => {
      jobStore.resetStore()

      jobStore.getJob(jobId)
      projectStore.getLastPackage(projectId)
    })

    const handleGoToCode = () =>
      context.root.$router.push({
        name: 'workspace-project-package',
        params: { projectId, workspaceId, packageId: projectStore.lastPackage.value.short_uuid }
      })

    const handleOnJobSave = () => jobStore.updateJob()
    const handleChangeDescription = data => jobStore.changeJob(data)

    return {
      ...jobStore,
      lastPackage: projectStore.lastPackage,
      handleGoToCode,
      handleOnJobSave,
      handleChangeDescription
    }
  }
})
</script>
