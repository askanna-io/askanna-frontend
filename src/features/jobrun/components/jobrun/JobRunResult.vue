<template>
  <v-list class="transparent" max-width="450px">
    <v-list-item>
      <v-list-item-title>Result:</v-list-item-title>
      <v-list-item-title class="text-left">
        {{ returnPayload }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script>
import { JobRun } from '../../store/types'
import { computed, defineComponent } from '@vue/composition-api'
import useJobRunStore from '../../composition/useJobRunStore'

export default defineComponent({
  name: 'JobRunResult',

  setup(context, props) {
    const jobRunStore = useJobRunStore()
    const returnPayload = computed(() => jobRunStore.jobRun.value.return_payload)

    return {
      returnPayload
    }
  }
})
</script>
