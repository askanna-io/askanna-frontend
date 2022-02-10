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

<script lang="ts">
import { useFileStore } from '@/features/file/useFileStore'
import JobsList from '@/features/jobs/components/JobsList.vue'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'jobs',

  components: {
    JobsList
  },

  setup(_, context) {
    const fileStore = useFileStore()
    const jobRunStore = useJobRunStore()
    const projectStore = useProjectStore()

    const { projectId } = context.root.$route.params

    const fetchData = async () => {
      fileStore.$reset()
      await jobRunStore.actions.resetStore()
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
