<template>
  <job-run-result v-if="jobRun.short_uuid" :jobRun="jobRun" />
</template>

<script lang="ts">
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import JobRunResult from '@/features/jobrun/components/jobrun/JobRunResult.vue'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  components: { JobRunResult },

  setup(_, context) {
    const jobRunStore = useJobRunStore()
    const jobRun = computed(() => jobRunStore.state.jobRun.value)

    const fetchData = async () => {
      const { jobRunId } = context.root.$route.params

      if (jobRunStore.state.jobRun.value.short_uuid !== jobRunId) {
        await jobRunStore.actions.resetStore()
        await jobRunStore.actions.getJobRun(jobRunId)
      }
    }

    onBeforeMount(() => fetchData())

    return { jobRun }
  }
})
</script>
