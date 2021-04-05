<template>
  <div class="px-4">
    <v-toolbar v-if="!isJobRunResultEmpty" dense flat color="grey lighten-4" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-btn
            small
            :disabled="loading || isJobRunResultEmpty"
            outlined
            v-on="on"
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload('raw')"
          >
            <v-icon color="secondary" left>mdi-download</v-icon>Download file
          </v-btn>

          <v-tooltip top v-if="false">
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :disabled="loading || isJobRunResultEmpty"
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                @click="handleDownload('formated')"
              >
                <v-icon color="secondary" left>mdi-download</v-icon>Formated
              </v-btn>
            </template>
            <span>Download formated</span>
          </v-tooltip>

          <v-btn
            small
            v-on="on"
            :disabled="loading || isJobRunResultEmpty"
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleCopy()"
          >
            <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
          </v-btn>
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
        <the-highlight v-if="!isJobRunResultEmpty" :value="jobRunResultForView" languageName="json" readonly />

        <v-alert v-if="isJobRunResultEmpty" class="my-2 mb-0 text-center" dense outlined color="grey">
          There is no result available for this run.
        </v-alert>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script>
import { useWindowSize } from '@u3u/vue-hooks'
import useJobRunStore from '../../composition/useJobRunStore'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import TheHighlight from '@/core/components/highlight/TheHighlight'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

export default defineComponent({
  name: 'JobRunResult',

  components: { TheHighlight, AskAnnaLoadingProgress },

  setup(_, context) {
    const snackBar = useSnackBar()

    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()
    const forceFileDownload = useForceFileDownload()

    const jobRunResult = computed(() => jobRunStore.jobRunResult.value)
    const jobRunResultRaw = computed(() => jobRunResult.value)
    const jobRunResultFormated = computed(() => jobRunResult.value)
    const jobRunResultForView = computed(() => jobRunResult.value.slice(0, 100000))

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

      forceFileDownload.trigger({ source, name: `run_${jobRunStore.jobRun.value.short_uuid}_result.json` })
    }

    const handleCopy = () => {
      context.root.$copyText(jobRunResultRaw.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
        }
      )
    }

    return {
      loading,
      scrollerStyles,
      jobRunResultForView,
      isJobRunResultEmpty,

      handleCopy,
      handleDownload
    }
  }
})
</script>
