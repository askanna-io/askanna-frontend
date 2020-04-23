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

    <job-running />
  </v-card>
</template>

<script>
import JobRunning from '../components/JobRunning'
import useJobStore from '../composition/useJobStore'
import JobDescription from '../components/JobDescription'

import { onBeforeMount, defineComponent, onBeforeDestroy } from '@vue/composition-api'

export default defineComponent({
  name: 'JobOverview',

  components: {
    JobRunning,
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
