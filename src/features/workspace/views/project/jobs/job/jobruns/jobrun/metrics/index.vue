<template>
  <div class="px-4">
    <v-card flat>
      <v-toolbar flat dense color="grey lighten-4" :class="{ 'br-r4': !sticked }" sticky-offset="{top: 48, bottom: 10}">
        <v-flex class="d-flex">
          <div class="mr-auto d-flex align-center"></div>

          <div>
            <v-btn
              small
              outlined
              color="secondary"
              class="mr-1 btn--hover"
              @click="handleDownload"
              :disabled="disabledTools"
            >
              <v-icon color="secondary" left>mdi-download</v-icon>Download JSON
            </v-btn>
            <v-btn
              small
              outlined
              color="secondary"
              @click="handleCopy"
              class="mr-1 btn--hover"
              :disabled="disabledTools"
            >
              <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy JSON
            </v-btn>
          </div>

          <v-card class="ml-4" flat width="115" color="grey lighten-4">
            <v-select
              dense
              hide-details
              return-object
              :items="views"
              persistent-hint
              item-text="name"
              item-value="value"
              v-model="viewModel"
              :disabled="disabledTools"
              :menu-props="{ bottom: true, offsetY: true }"
            >
              <template v-slot:selection="{ item }"> View: {{ item.name }} </template>
            </v-select>
          </v-card>
        </v-flex>
      </v-toolbar>
      <router-view />
    </v-card>
  </div>
</template>

<script>
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useMetricStore from '@/features/metric/composition/useMetricStore'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { ref, computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'metric-index',

  setup(props, context) {
    const snackBar = useSnackBar()
    const metricStore = useMetricStore()
    const projectStore = useProjectStore()
    const forceFileDownload = useForceFileDownload()

    const { jobRunId: uuid } = context.root.$route.params

    const views = [
      { name: 'Table', value: 'table' },
      { name: 'JSON', value: 'json' }
      // { name: 'Card', value: 'card' },
      // { name: 'Grid', value: 'grid' }
    ]
    const currentView = ref(views[0])

    const sticked = computed(() => !projectStore.stickedVM.value)
    const items = computed(() => metricStore.state.metrics.value.results)
    const metricFullData = computed(() => metricStore.state.metricFullData.value)
    const metricJSON = computed(() => JSON.stringify(metricStore.state.metricJSON.value.results, null, 2))

    const viewModel = computed({
      get: () => {
        return currentView.value
      },
      set: view => {
        if (view.value === currentView.value.value) return
        currentView.value = view
        context.root.$router.push({ name: `workspace-project-jobs-job-jobrun-metrics-${view.value}` })
      }
    })

    const disabledTools = computed(
      () =>
        (currentView.value.value === 'table' && !items.value.length) ||
        (currentView.value.value === 'json' && !metricJSON.value)
    )

    const handleCopy = async () => {
      if (!metricFullData.value) await metricStore.actions.getMetricFullData({ uuid })

      context.root.$copyText(metricFullData.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
        }
      )
    }

    const handleDownload = async () => {
      if (!metricFullData.value) await metricStore.actions.getMetricFullData({ uuid })

      forceFileDownload.trigger({ source: metricFullData.value, name: `run_${uuid}_metrics.json` })
    }

    onBeforeMount(async () => {
      const view = context.root.$route.meta.tabValue
      if (view) {
        currentView.value = views.find(item => item.value === view)
      }
    })

    return {
      items,
      views,
      sticked,
      viewModel,
      disabledTools,

      handleCopy,
      handleDownload
    }
  }
})
</script>
<style scoped>
.h-20 {
  height: 20px !important;
}
</style>
