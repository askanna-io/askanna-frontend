<template>
  <v-list class="transparent" max-width="650px">
    <v-list-item>
      <v-list-item-title>Status: <ask-anna-chip-status :status="jobRun.status" /> </v-list-item-title>
      <v-list-item-title class="text-left"> Duratation: &nbsp;{{ jobRun.runtime }} seconds </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-title
        >Job:
        <v-chip small outlined label :to="{ name: 'workspace-project-job-overiew' }">
          {{ jobName }}
        </v-chip></v-list-item-title
      >
      <v-list-item-title class="text-left">
        CPU: 10%
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-title>Version: {{ jobRun.version.name }}: #{{ jobRun.version.uuid }}</v-list-item-title>
      <v-list-item-title class="text-left"> Runner/worker: {{ jobRun.runner.name }} </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-title>By: {{ jobRun.owner.name }}</v-list-item-title>
      <v-list-item-title class="text-left"> Trigger: {{ jobRun.trigger.name }} </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-title>Memory: {{ jobRun.memory }}MB</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import { JobRun } from '../../store/types'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfo',

  props: {
    jobRun: {
      type: Object as () => JobRun
    },
    jobName: {
      type: String,
      default: ''
    }
  }
})
</script>
