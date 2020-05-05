<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Result</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-list class="transparent" max-width="450px">
        <v-list-item>
          <v-list-item-title>Result:</v-list-item-title>
          <v-list-item-title class="text-left">
            {{ jobRun.return_payload }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
<script lang="ts">
import { JobRun } from '../../store/types'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunResult',

  props: {
    jobRun: {
      type: Object as () => JobRun
    }
  }
})
</script>
