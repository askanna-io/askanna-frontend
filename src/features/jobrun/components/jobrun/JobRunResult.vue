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
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload"
          >
            <v-icon color="secondary" left>mdi-download</v-icon>Download file
          </v-btn>
          <v-btn
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
          <v-card class="ml-4" flat width="115" color="grey lighten-4" v-if="jobRunResult.isValidJSON">
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
    <v-flex :style="scrollerStyles" class="mb-4 overflow-y-auto" id="scroll-target">
      <ask-anna-loading-progress
        :loading="loading"
        fullWidth
        height="94"
        transition="transition"
        type="list-item-two-line"
      >
        <the-highlight
          v-if="!isJobRunResultEmpty"
          readonly
          languageName="json"
          :value="jobRunResultForView"
          v-scroll:#scroll-target="handleOnScroll"
        />

        <v-alert v-if="isJobRunResultEmpty" class="my-2 mb-0 text-center" dense outlined color="grey">
          There is no result available for this run.
        </v-alert>
      </ask-anna-loading-progress>
    </v-flex>
  </div>
</template>
<script>
import { throttle } from 'lodash'
import { useWindowSize } from '@u3u/vue-hooks'
import usePrettyJSON from '@/core/composition/usePrettyJSON'
import useJobRunStore from '../../composition/useJobRunStore'

import useSnackBar from '@/core/components/snackBar/useSnackBar'
import TheHighlight from '@/core/components/highlight/TheHighlight'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import { ref, computed, defineComponent, onBeforeMount } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

export default defineComponent({
  name: 'JobRunResult',

  components: { TheHighlight, AskAnnaLoadingProgress },

  setup(_, context) {
    const snackBar = useSnackBar()

    const { height } = useWindowSize()
    const prettyJSON = usePrettyJSON()
    const jobRunStore = useJobRunStore()
    const forceFileDownload = useForceFileDownload()

    const views = [
      { name: 'Pretty', value: 'pretty' },
      { name: 'Raw', value: 'raw' }
    ]
    const currentScrollTop = ref(0)
    const currentView = ref(views[0])

    const viewModel = computed({
      get: () => {
        return currentView.value
      },
      set: view => {
        if (view.value === currentView.value.value) return
        currentView.value = view
      }
    })

    const jobRunResult = computed(() => prettyJSON(jobRunStore.jobRunResult.value, 2))
    const jobRunResultRaw = computed(() => jobRunStore.jobRunResult.value)
    const jobRunResultFormated = computed(() => jobRunResult.value.prettyJson)
    const jobRunResultForView = computed(() =>
      currentView.value.value === 'raw' ? jobRunResultRaw.value : jobRunResultFormated.value
    )

    const jobRunResultSource = computed(() =>
      currentView.value.value === 'raw' ? jobRunResultRaw.value : jobRunResultFormated.value
    )

    const loading = computed(() => jobRunStore.resultLoading.value)
    const isJobRunResultEmpty = computed(() => !jobRunResult.value && !loading.value)

    onBeforeMount(async () => {
      const { jobRunId } = context.root.$route.params

      await jobRunStore.getJobRunResult(jobRunId)
    })

    const maxHeight = computed(() => height.value - 150)
    const scrollerStyles = computed(() => {
      return { 'max-height': `${maxHeight.value}px` }
    })

    const handleDownload = async () => {
      forceFileDownload.trigger({
        source: jobRunStore.jobRunResult.value,
        name: `run_${jobRunStore.jobRun.value.short_uuid}_result.json`
      })
    }

    const handleCopy = () => {
      context.root.$copyText(jobRunResultSource.value).then(
        () => snackBar.showSnackBar({ message: 'Copied', color: 'success' }),
        () => snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
      )
    }

    const onScroll = scrollTop => {
      if (scrollTop > currentScrollTop.value) {
        window.scrollTo(0, window.pageYOffset + 10)
        currentScrollTop.value = scrollTop
      }
    }

    const throttled = throttle(onScroll, 1500)

    const handleOnScroll = e => {
      window.scrollTo(0, window.pageYOffset + 10)
      throttled(e.target.scrollTop)
    }

    return {
      views,
      loading,
      viewModel,
      currentView,
      jobRunResult,
      scrollerStyles,
      jobRunResultForView,
      isJobRunResultEmpty,

      handleCopy,
      handleDownload,
      handleOnScroll
    }
  }
})
</script>
