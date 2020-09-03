<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-3" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                small
                :disabled="loading || isJobRunResultEmpty"
                outlined
                v-on="on"
                color="secondary"
                class="mr-1"
                @click="handleDownload('raw')"
              >
                <v-icon color="secondary" left>mdi-download</v-icon>Raw
              </v-btn>
            </template>
            <span>Download raw</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :disabled="loading || isJobRunResultEmpty"
                small
                outlined
                color="secondary"
                class="mr-1"
                @click="handleDownload('formated')"
              >
                <v-icon color="secondary" left>mdi-download</v-icon>Formated
              </v-btn>
            </template>
            <span>Download formated</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                small
                v-on="on"
                :disabled="loading || isJobRunResultEmpty"
                outlined
                color="secondary"
                @click="handleCopy()"
              >
                <v-icon color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex :style="scrollerStyles" class="mb-4 overflow-y-auto" id="scroll-target">
      <ask-anna-loading-progress
        :loading="loading"
        fullWidth
        transition="transition"
        height="94"
        type="list-item-two-line"
      >
        <prism-editor
          v-if="!isJobRunResultEmpty"
          v-scroll:#scroll-target="onScroll"
          :code="jobRunResultForView"
          readonly
          line-numbers
        />

        <v-alert v-if="isJobRunResultEmpty" class="my-2" dense outlined color="grey">
          There is no result available for this run.
        </v-alert>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script>
import PrismEditor from 'vue-prism-editor'
import { JobRun } from '../../store/types'
import { useWindowSize } from '@u3u/vue-hooks'
import useSnackBar from '@/core/components/snackBar/useSnackBar'

import useJobRunStore from '../../composition/useJobRunStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

export default defineComponent({
  name: 'JobRunResult',

  components: { PrismEditor },

  setup(props, context) {
    const snackBar = useSnackBar()

    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
    const forceFileDownload = useForceFileDownload()

    const jobRunResult = computed(() => jobRunStore.jobRunResult.value)
    const jobRunResultRaw = computed(() => JSON.stringify(jobRunResult.value))
    const jobRunResultFormated = computed(() => JSON.stringify(jobRunResult.value, null, 2))
    const jobRunResultForView = computed(() => {
      return jobRunResultFormated.value.slice(0, 100000)
    })

    const loading = computed(() => jobRunStore.resultLoading.value)
    const isJobRunResultEmpty = computed(() => !jobRunResult.value && !loading.value)

    onBeforeMount(async () => {
      const { jobRunId } = context.root.$route.params

      jobRunStore.getJobRunResult(jobRunId)
    })

    const maxHeight = computed(() => height.value - 270)
    const scrollerStyles = computed(() => {
      return { 'max-height': `${maxHeight.value}px` }
    })

    const handleDownload = async formatType => {
      const source = formatType === 'raw' ? jobRunResultRaw.value : jobRunResultFormated.value

      forceFileDownload.trigger({ source, name: `${jobRunStore.jobRun.value.short_uuid}-result.json` })
    }

    const handleCopy = () => {
      context.root.$copyText(jobRunResultRaw.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    const onScroll = e => {}

    return {
      loading,
      jobRunResultForView,
      scrollerStyles,
      isJobRunResultEmpty,

      onScroll,
      handleCopy,
      handleDownload
    }
  }
})
</script>
