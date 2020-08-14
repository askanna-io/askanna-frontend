<template>
  <v-card flat class="px-3 mt-2 br-none" outlined>
    <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="jobsLoading">
      <v-row align="center" justify="center">
        <v-col cols="12" class="pa-0">
          <jobs-list :jobList="projectJobs" />
        </v-col>
      </v-row>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import JobsList from '@/features/jobs/components/JobsList'
import useProjectStore from '@project/composition/useProjectStore'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'jobs',

  components: {
    JobsList
  },

  setup(props, context) {
    const projectStore = useProjectStore()
    const { projectId } = context.root.$route.params

    onBeforeMount(async () => {
      await projectStore.resetProjectJobs()
      await projectStore.getProjectJobs(projectId)
    })

    const projectJobs = computed(() => projectStore.projectJobs.value)

    return {
      projectJobs,
      jobsLoading: projectStore.jobsLoading
    }
  }
})
</script>
