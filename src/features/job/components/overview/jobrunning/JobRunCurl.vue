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
  </v-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

import useJobStore from '@job/composition/useJobStore'

export default defineComponent({
  name: 'JobRunCurl',

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
