<template>
  <div class="px-4">
    <v-card flat>
      <v-toolbar
        v-if="!disabledTools"
        flat
        dense
        color="grey lighten-4"
        :class="{ 'br-r4': !sticked }"
        sticky-offset="{top: 48, bottom: 10}"
      >
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

          <v-card class="ml-4" flat width="175" color="grey lighten-4" v-if="false">
            <v-select
              dense
              hide-details
              return-object
              :items="groupByValues"
              persistent-hint
              item-text="name"
              item-value="value"
              v-model="currentGroupBy"
              :disabled="disabledTools"
              :menu-props="{ bottom: true, offsetY: true }"
            >
              <template v-slot:selection="{ item }"> Group by: {{ item.name }} </template>
            </v-select>
          </v-card>

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
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { ref, computed, defineComponent, onBeforeMount } from '@vue/composition-api'
import useRuninfoVariablesStore from '@/features/runinfo-variables/composition/useRuninfoVariablesStore'

export default defineComponent({
  name: 'variables-index',

  setup(props, context) {
    const snackBar = useSnackBar()
    const runinfoVariablesStore = useRuninfoVariablesStore()

    const projectStore = useProjectStore()
    const forceFileDownload = useForceFileDownload()

    const { jobRunId: uuid } = context.root.$route.params

    const views = [
      { name: 'Table', value: 'table' },
      { name: 'JSON', value: 'json' }
      // { name: 'Card', value: 'card' },
      // { name: 'Grid', value: 'grid' }
    ]

    const defaultGroupByValues = [{ name: 'Name', value: 'name' }]

    const currentView = ref(views[0])
    const currentGroupBy = ref(defaultGroupByValues[0])

    const sticked = computed(() => !projectStore.stickedVM.value)
    const labels = computed(() => runinfoVariablesStore.state.variablesLabels.value)
    const items = computed(() => runinfoVariablesStore.state.variables.value.results)
    const variablesFullData = computed(() => runinfoVariablesStore.state.variablesFullData.value)
    const variablesJSON = computed(() =>
      JSON.stringify(runinfoVariablesStore.state.variablesJSON.value.results, null, 2)
    )

    // set labels to group select if they exist
    const groupByValues = computed(() =>
      labels.value.length ? [...defaultGroupByValues, ...labels.value] : defaultGroupByValues
    )

    const viewModel = computed({
      get: () => {
        return currentView.value
      },
      set: view => {
        if (view.value === currentView.value.value) return
        currentView.value = view
        context.root.$router.push({ name: `workspace-project-jobs-job-jobrun-variables-${view.value}` })
      }
    })

    const disabledTools = computed(
      () =>
        (currentView.value.value === 'table' && !items.value.length) ||
        (currentView.value.value === 'json' && !variablesJSON.value)
    )

    const handleCopy = async () => {
      if (!variablesFullData.value) await runinfoVariablesStore.actions.getVariablesFullData({ uuid })

      context.root.$copyText(variablesFullData.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
        }
      )
    }

    const handleDownload = async () => {
      if (!variablesFullData.value) await runinfoVariablesStore.actions.getVariablesFullData({ uuid })

      forceFileDownload.trigger({ source: variablesFullData.value, name: `run_${uuid}_variables.json` })
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
      groupByValues,
      currentGroupBy,

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
