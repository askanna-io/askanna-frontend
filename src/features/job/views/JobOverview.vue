<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Description:</v-card-title>
    <v-divider />
    <job-description
      :description="job.description"
      @onSave="handleOnJobSave"
      @onChangeDescription="handleChangeDescription"
    />
    <v-divider />
    <job-definition :job="job" />
    <v-divider />

    <job-running />
  </v-card>
</template>

<script>
import useJobStore from '../composition/useJobStore'
import JobRunning from '../components/overview/JobRunning'
import JobDefinition from '../components/overview/JobDefinition'

import JobDescription from '../components/overview/JobDescription'

import { onBeforeMount, defineComponent, onBeforeDestroy } from '@vue/composition-api'

export default defineComponent({
  name: 'JobOverview',

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
  },

  data() {
    return {
      selection: 2
    }
  }
})
</script>
