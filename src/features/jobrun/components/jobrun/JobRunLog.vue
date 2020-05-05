<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Log</v-expansion-panel-header>
    <v-expansion-panel-content> </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script lang="ts">
import { JobRun } from '../../store/types'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunLog',

  props: {
    jobRun: {
      type: Object as () => JobRun
    }
  }
})
</script>
