<template>
  <v-container class="ma-0" fluid>
    <v-row>
      <v-col cols="12" sm="6">
        <v-textarea dense hide-details no-resize filled rows="6" outlined label="Input" value="" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-textarea dense hide-details no-resize filled rows="6" outlined label="Response" value="" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-chip outlined label class="askaanna-chip-status" color="success" @click.stop="startJob(jobId)">
          <v-avatar left><v-icon>mdi-play</v-icon></v-avatar
          >Run</v-chip
        >
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col cols="12" sm="6">
        <v-select :items="[]" dense outlined persistent-hint label="Input" hint="Select a run" />
        <v-chip outlined label class="askaanna-chip-status" color="success" @click.stop="startJob(jobId)">
          <v-avatar left><v-icon>mdi-play</v-icon></v-avatar
          >Run</v-chip
        >
      </v-col>
      <v-col cols="12" sm="6">
        <v-textarea dense hide-details no-resize filled rows="6" outlined label="Response" value="" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import useJobStore from '@job/composition/useJobStore'

export default defineComponent({
  name: 'JobRunPortal',

  setup(props, context) {
    const jobStore = useJobStore()
    const { jobId } = context.root.$route.params

    return {
      ...jobStore,
      jobId
    }
  }
})
</script>
