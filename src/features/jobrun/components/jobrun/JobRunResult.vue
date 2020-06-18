<template>
  <v-list class="transparent" max-width="450px">
    <v-list-item>
      <v-list-item-title>Result:</v-list-item-title>
      <v-list-item-title class="text-left">
        {{ jobRunResult }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script>
import { JobRun } from '../../store/types'
import useJobRunStore from '../../composition/useJobRunStore'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunResult',

  setup(props, context) {
    const jobRunStore = useJobRunStore()
    const jobRunResult = computed(() => jobRunStore.jobRunResult.value)

    onBeforeMount(async () => {
      const { jobRunId } = context.root.$route.params

      jobRunStore.getJobRunResult(jobRunId)
    })

    return {
      jobRunResult
    }
  }
})
</script>
