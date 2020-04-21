<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Description:</v-card-title>
    <v-divider />
    <job-description
      :description="job.description"
      @onSave="handleOnJobSave"
      @onChangeDescription="handleChangeDescription"
    />
  </v-card>
</template>

<script>
import { onBeforeMount, defineComponent, onBeforeDestroy } from '@vue/composition-api'
import useJobStore from '../composition/useJobStore'
import JobDescription from '../components/JobDescription'

export default defineComponent({
  name: 'JobOverview',

  components: {
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
