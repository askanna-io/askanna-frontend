<template>
  <div>
    <v-toolbar dense flat>
      <v-flex class="d-flex">
        <div class="cursor--pointer mr-auto d-flex" @click="handleViewPayload(jobRun)">
          <div class="pa-3">
            Input
          </div>
        </div>
        <div>
          <v-btn-toggle v-model="formatTypeComputed" dense @change="handleDownload(jobRun)">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn value="raw" v-on="on">
                  <v-icon>mdi-cloud-download</v-icon>
                </v-btn>
              </template>
              <span>Download raw</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn value="formated" v-on="on">
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </template>
              <span>Download formated</span>
            </v-tooltip>
          </v-btn-toggle>

          <v-btn-toggle group class="pl-2" dense @change="handleViewPayload(jobRun)">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn value="raw" v-on="on">
                  <v-icon>mdi-file-outline</v-icon>
                </v-btn>
              </template>
              <span>View</span>
            </v-tooltip>
          </v-btn-toggle>
        </div>
      </v-flex>
    </v-toolbar>
    <v-divider />
    <v-expand-transition>
      <v-flex v-if="showPayload">
        <job-run-pay-load :file="jobRunPayload" />
      </v-flex>
    </v-expand-transition>
  </div>
</template>
<script lang="ts">
import { JobRun } from '../../store/types'
import JobRunPayLoad from '../JobRunPayLoad.vue'
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInput',

  components: {
    JobRunPayLoad
  },

  props: {
    jobRun: {
      type: Object as () => JobRun
    },
    formatType: {
      type: String,
      default: ''
    },
    showPayload: {
      type: Boolean,
      default: false
    },
    jobRunPayload: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const handleDownload = (item: JobRun) => context.emit('handleDownload', item)
    const handleViewPayload = (item: JobRun) => context.emit('handleViewPayload', item)

    const formatTypeComputed = computed({
      get: () => {
        return props.formatType
      },
      set: value => {
        context.emit('changeFormType', value)
      }
    })

    return {
      handleDownload,
      handleViewPayload,
      formatTypeComputed
    }
  }
})
</script>
