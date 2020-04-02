<template>
  <v-card flat class="px-3 mt-2 br-none" outlined>
    <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="!projectJobs.length">
      <the-jobs :data="projectJobs" /> </v-skeleton-loader
  ></v-card>
</template>

<script>
import { createComponent, onBeforeMount } from '@vue/composition-api'
import TheJobs from '@jobs/views/TheJobs'

import useProjectStore from '../../../composition/useProjectStore'
import useQuery from '@/core/composition/useQuery'

export default createComponent({
  name: 'RunsCode',

  components: {
    TheJobs
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
      ...projectStore
    }
  }
})
</script>
