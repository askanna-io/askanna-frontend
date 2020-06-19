<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-3" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>
        <div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :disabled="loading || logNoAvailable"
                small
                outlined
                color="secondary"
                class="mr-1"
                @click="handleDownload()"
              >
                <v-icon color="secondary">mdi-download</v-icon>
              </v-btn>
            </template>
            <span>Download</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                :disabled="loading || logNoAvailable"
                small
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
      <v-skeleton-loader
        v-if="!logNoAvailable"
        :loading="loading"
        transition="transition"
        height="94"
        type="list-item-two-line"
      >
        <prism-editor v-scroll:#scroll-target="onScroll" :code="logs" readonly line-numbers />
      </v-skeleton-loader>
      <v-alert v-if="logNoAvailable" class="my-2" dense outlined color="grey">
        No log entries are available for this job run.
      </v-alert>
    </v-flex>
  </div>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import { useWindowSize } from '@u3u/vue-hooks'
import useMoment from '@/core/composition/useMoment'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import { reactive, computed, defineComponent } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'JobRunLog',

  components: {
    PrismEditor
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const moment = useMoment(context)
    const { height } = useWindowSize()
    const forceFileDownload = useForceFileDownload()

    const jobRunStore = useJobRunStore()
    const logs = computed(() => {
      if (!jobRunStore.jobRun.value.stdout) return ''

      const reducer = (acc, cr) => {
        acc = acc + `${cr[2]} \n`
        return acc
      }
      const result = jobRunStore.jobRun.value.stdout.length ? jobRunStore.jobRun.value.stdout.reduce(reducer, ``) : ''
      return result
    })

    const maxHeight = computed(() => height.value - 270)
    const scrollerStyles = computed(() => {
      return { 'max-height': `${maxHeight.value}px` }
    })
    const loading = computed(() => jobRunStore.jobRun.value.stdout && jobRunStore.jobRun.value.stdout.length === 0)

    const logNoAvailable = computed(() => jobRunStore.jobRun.value.stdout === null)

    const handleCopy = () => {
      context.root.$copyText(logs.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    const handleDownload = () =>
      forceFileDownload.trigger({ source: logs.value, name: `${jobRunStore.jobRun.value.short_uuid}_log.txt` })
    const onScroll = e => {}

    return {
      logs,
      loading,
      onScroll,
      handleCopy,
      logNoAvailable,
      scrollerStyles,
      handleDownload
    }
  }
})
</script>
