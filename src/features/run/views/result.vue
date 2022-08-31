<template>
  <run-result v-if="run.short_uuid" :run="run" />
</template>

<script lang="ts">
import { useRunStore } from '@/features/run/useRunStore'
import { useFileStore } from '@/features/file/useFileStore'
import RunResult from '@/features/run/components/RunResult.vue'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  components: { RunResult },

  setup(_, context) {
    const fileStore = useFileStore()
    const runStore = useRunStore()

    const run = computed(() => runStore.run)

    const fetchData = async () => {
      fileStore.$reset()

      const { runId } = context.root.$route.params

      if (runStore.run.short_uuid !== runId) {
        await runStore.resetStore()
        await runStore.getRun(runId)
      }
    }

    onBeforeMount(() => fetchData())

    return { run }
  }
})
</script>
