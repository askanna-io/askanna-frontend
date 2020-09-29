<template>
  <v-container class="ma-0" fluid>
    <v-row>
      <v-col cols="12">
        <ask-anna-code :code="code" :title="'JSON data'" @onInput="handleOnInput($event, 'code')" />
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
import { ref, defineComponent } from '@vue/composition-api'
import useJobStore from '@job/composition/useJobStore'
import AskAnnaCode from '@/core/components/shared/AskAnnaCode'

export default defineComponent({
  name: 'JobRunPlatform',

  components: {
    AskAnnaCode
  },

  setup(props, context) {
    const jobStore = useJobStore()

    const code = ref(`{
    "parameter": "test",
    "data": {
        "foo": "bar",
        "bar": "foo"
    }
}`)
    const { jobId } = context.root.$route.params

    const handleOnInput = value => (code.value = value)
    return {
      code,
      ...jobStore,
      jobId,
      handleOnInput
    }
  }
})
</script>
