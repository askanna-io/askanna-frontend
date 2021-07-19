<template>
  <v-card flat class="px-3 mt-2 br-none" outlined>
    <ask-anna-loading-progress :type="'table-row'" :loading="jobsLoading">
      <v-row align="center" justify="center">
        <v-col cols="12" class="pa-0">
          <jobs-list :jobList="projectJobs" />
        </v-col>
      </v-row>
    </ask-anna-loading-progress>
  </v-card>
</template>

<script>
import JobsList from '@/features/jobs/components/JobsList'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useProjectStore from '@project/composition/useProjectStore'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'jobs',

  components: {
    JobsList
  },

  setup(_, context) {
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()
    const { projectId } = context.root.$route.params

    const fetchData = async () => {
      await jobRunStore.resetStore()
      await projectStore.resetProjectJobs()
      await projectStore.getProjectJobs(projectId)
    }

    onBeforeMount(() => fetchData())

    const projectJobs = computed(() => projectStore.projectJobs.value)

    return {
      projectJobs,
      jobsLoading: projectStore.jobsLoading
    }
  }
})
</script>
