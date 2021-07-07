<template>
  <div>
    <v-toolbar v-if="!loading && !isJobRunResultEmpty" dense flat color="grey lighten-4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-btn
            small
            :disabled="loading || isJobRunResultEmpty"
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload"
          >
            <v-icon color="secondary" left>mdi-download</v-icon>Download file
          </v-btn>
          <v-btn
            v-if="isResultJSON"
            small
            :disabled="loading || isJobRunResultEmpty"
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleCopy()"
          >
            <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
          </v-btn>
        </div>
        <div>
          <v-card class="ml-4" flat width="115" color="grey lighten-4" v-if="isValidJSON">
            <v-select
              dense
              hide-details
              return-object
              :items="views"
              persistent-hint
              item-text="name"
              item-value="value"
              v-model="viewModel"
              :menu-props="{ bottom: true, offsetY: true }"
            >
              <template v-slot:selection="{ item }"> View: {{ item.name }} </template>
            </v-select>
          </v-card>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
      <ask-anna-loading-progress
        :loading="loading"
        fullWidth
        height="94"
        classes="mx-4 mb-4"
        transition="transition"
        type="list-item-two-line"
      >
        <div>
          <job-run-result-preview
            v-if="!isJobRunResultEmpty"
            :fileExtension="jobRunResultExt"
            :dataSource="jobRunResultForView"
          />
          <v-flex v-if="!isJobRunResultEmpty && isJobRunResultBig && isShowPreview" class="my-2 mb-2 text-center">
            <v-btn
              text
              small
              outlined
              color="secondary"
              class="mr-1 btn--hover"
              @click="handleDownload"
              :disabled="loading || isJobRunResultEmpty"
            >
              <v-icon color="secondary" left>mdi-download</v-icon> ...to show the full result, please download the file
            </v-btn>
          </v-flex>
          <v-flex v-if="!isJobRunResultEmpty && !isShowPreview" class="my-2 mb-2 text-center">
            <v-btn
              text
              small
              outlined
              color="secondary"
              class="mr-1 btn--hover"
              @click="handleDownload"
              :disabled="loading || isJobRunResultEmpty"
            >
              <v-icon color="secondary" left>mdi-download</v-icon>We cannot show a preview of this file. Please download
              the file.
            </v-btn>
          </v-flex>

          <v-alert v-if="isJobRunResultEmpty" class="ma-4 text-center" dense outlined color="grey">
            There is no result available for this run.
          </v-alert>
        </div>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script>
import { useWindowSize } from '@u3u/vue-hooks'
import { JobRun, JobRunModel } from '../../store/types'
import usePrettyJSON from '@/core/composition/usePrettyJSON'
import useJobRunStore from '../../composition/useJobRunStore'
import JobRunResultPreview from './result/JobRunResultPreview'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import TheHighlight from '@/core/components/highlight/TheHighlight'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import { ref, computed, defineComponent, onBeforeMount } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

export default defineComponent({
  name: 'JobRunResult',

  props: {
    jobRun: {
      type: Object,
      default: new JobRunModel().state
    }
  },

  components: { TheHighlight, JobRunResultPreview, AskAnnaLoadingProgress },

  setup(props, context) {
    const snackBar = useSnackBar()
    const { height } = useWindowSize()
    const prettyJSON = usePrettyJSON()
    const jobRunStore = useJobRunStore()
    const router = useRouterAskAnna(context)
    const forceFileDownload = useForceFileDownload()

    const views = [
      { name: 'Pretty', value: 'pretty' },
      { name: 'Raw', value: 'raw' }
    ]
    const { view, jobRunId } = context.root.$route.params

    const currentView = ref(views[0])

    const viewModel = computed({
      get: () => currentView.value,
      set: view => {
        if (view.value === currentView.value.value) return
        currentView.value = view
        router.push({ name: 'workspace-project-jobs-job-jobrun-result', params: { view: view.value } })
      }
    })

    const loading = computed(() => jobRunStore.resultLoading.value)
    const isResultJSON = computed(() => jobRunStore.isResultJSON.value)
    const isShowPreview = computed(() => jobRunStore.isShowPreview.value)
    const jobRunResultRaw = computed(() => jobRunStore.jobRunResult.value)
    const jobRunResultExt = computed(() => jobRunStore.jobRunResultExt.value)

    const isJobRunResultBig = computed(() => jobRunStore.isJobRunResultBig.value)
    const isJobRunResultEmpty = computed(() => !jobRunResultPreview.value && !loading.value)

    const jobRunResultPreview = computed(() =>
      jobRunResultExt.value === 'json'
        ? prettyJSON(jobRunStore.jobRunResultPreview.value, 2)
        : jobRunStore.jobRunResultPreview.value
    )

    const isValidJSON = computed(() => jobRunResultPreview.value.isValidJSON)

    const jobRunResultFormated = computed(() => jobRunResultPreview.value.prettyJson)
    const jobRunResultForView = computed(() => {
      if (!isResultJSON.value) return jobRunStore.jobRunResultPreview.value

      return currentView.value.value === 'raw' ? jobRunStore.jobRunResultPreview.value : jobRunResultFormated.value
    })

    const jobRunResultSource = computed(() =>
      currentView.value.value === 'raw' ? jobRunResultRaw.value : prettyJSON(jobRunResultRaw.value, 2).prettyJson
    )

    onBeforeMount(async () => {
      if (view) {
        currentView.value = views.find(el => el.value === view) || views[0]
      }
      await jobRunStore.getJobRunResultPreview(jobRunId)
    })

    const maxHeight = computed(() => height.value - 110)
    const scrollerStyles = computed(() => {
      return { 'max-height': `${maxHeight.value}px` }
    })

    const handleDownload = async () => {
      // download full version of result without formating
      await jobRunStore.getJobRunResult(jobRunId)

      forceFileDownload.trigger({
        source: jobRunResultRaw.value,
        name: `run_${jobRunStore.jobRun.value.short_uuid}_result_${jobRunStore.jobRun.value.result.original_name}`
      })

      //run_{run_suuid}_result_{original_name}
    }

    const handleCopy = async () => {
      await jobRunStore.getJobRunResult(jobRunId)

      context.root.$copyText(jobRunResultSource.value).then(
        () => snackBar.showSnackBar({ message: 'Copied', color: 'success' }),
        () => snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
      )
    }

    return {
      views,
      loading,
      viewModel,
      isValidJSON,
      currentView,
      isResultJSON,
      isShowPreview,
      scrollerStyles,
      jobRunResultExt,
      isJobRunResultBig,
      isJobRunResultEmpty,
      jobRunResultForView,

      handleCopy,
      handleDownload
    }
  }
})
</script>
