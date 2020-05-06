<template>
  <v-card flat class="px-3 mt-2 br-none" outlined>
    <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!projectJobs.length">
      <v-row align="center" justify="center">
        <v-col cols="12" class="pa-0">
          <jobs-list :jobList="projectJobs" />
        </v-col>
      </v-row> </v-skeleton-loader
  ></v-card>
</template>

<script>
import JobsList from '@jobs/components/JobsList'
import useQuery from '@/core/composition/useQuery'
import useProjectStore from '@project/composition/useProjectStore'
import { defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'jobs',

  components: {
    JobsList
  },

  setup(props, context) {
    const projectStore = useProjectStore()
    const { projectId } = context.root.$route.params
    const query = useQuery()

    onBeforeMount(() => {
      projectStore.resetProjectJobs()
      projectStore.getProjectJobs(projectId, query.params)
    })

    return {
      projectJobs: projectStore.projectJobs.value
    }
  }
})
</script>
