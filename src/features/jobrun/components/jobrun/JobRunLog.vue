<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pb-0 pt-0">
      <div class="page">
        <div style="max-height: 420px;" class="overflow-y-auto" id="scroll-target">
          <prism-editor v-scroll:#scroll-target="onScroll" v-if="logs" :code="logs" readonly line-numbers />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import useMoment from '@/core/composition/useMoment'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import { reactive, computed, defineComponent } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

export default defineComponent({
  name: 'JobRunLog',

  components: {
    PrismEditor
  },

  props: {
    file: String,
    fileSource: Blob
  },

  setup(props, context) {
    const snackBar = useSnackBar()
    const moment = useMoment(context)
    const forceFileDownload = useForceFileDownload()

    const state = reactive({
      sliceStart: 0,
      sliceEnd: 100000
    })

    const jobRunStore = useJobRunStore()
    const logs = computed(() => {
      const reducer = (acc, cr) => {
        acc = acc + `${moment.$moment(cr[1]).format(' Do MMMM YYYY, h:mm:ss a')} ${cr[2]} \n `
        return acc
      }
      const result = jobRunStore.jobRun.value.stdout.length ? jobRunStore.jobRun.value.stdout.reduce(reducer, ``) : ''
      return result
    })

    const handleBack = () => context.root.$router.back(-1)

    const handleCopy = () => {
      context.root.$copyText(props.file).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    const handleDownload = () => forceFileDownload.trigger({ source: props.file, name: 'test' })
    const onScroll = e => {}

    return {
      logs,
      state,
      onScroll,
      handleBack,
      handleCopy,
      handleDownload
    }
  }
})
</script>
<style>
.prism-editor-wrapper .language-js {
  box-shadow: none;
}
.big-json {
  max-height: 300px;
  overflow: hidden;
}

.scroll {
  height: 300px;
  width: 40px;
  overflow-y: scroll;
  display: inline-block;
}

.scroll .inner {
  height: 300%;
  width: 100%;
  content: '.';
}
.scroll.--simple::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scroll.--simple::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
.scroll.--simple::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}
.scroll.--simple::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}
.scroll.--simple::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.9);
}
</style>
