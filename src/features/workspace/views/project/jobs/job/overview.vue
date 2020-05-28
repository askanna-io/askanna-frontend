<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Description</v-card-title>
    <v-divider />
    <v-container class="ma-0 fluid">
      <job-description
        :description="job.description"
        @onSave="handleOnJobSave"
        @onChangeDescription="handleChangeDescription"
      />
    </v-container>
    <v-divider />
    <job-definition :job="job" />
    <v-divider />

    <job-running />
  </v-card>
</template>

<script>
import useJobStore from '@job/composition/useJobStore'
import JobRunning from '@job/components/overview/JobRunning'
import JobDefinition from '@job/components/overview/JobDefinition'
import JobDescription from '@job/components/overview/JobDescription'

import { onBeforeMount, defineComponent, onBeforeDestroy } from '@vue/composition-api'

export default defineComponent({
  components: {
    JobRunning,
    JobDefinition,
    JobDescription
  },

  setup(rops, context) {
    const jobStore = useJobStore()

    onBeforeMount(() => {
      jobStore.resetStore()
      const { jobId } = context.root.$route.params

      jobStore.getJob(jobId)
    })

    const handleOnJobSave = () => jobStore.updateJob()
    const handleChangeDescription = data => jobStore.changeJob(data)

    return {
      ...jobStore,
      handleOnJobSave,
      handleChangeDescription
    }
  }
})
</script>
