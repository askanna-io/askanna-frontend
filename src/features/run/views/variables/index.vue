<template>
  <div>
    <v-toolbar v-if="!disabledTools" flat dense color="grey lighten-4" sticky-offset="{top: 48, bottom: 10}">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>

        <div>
          <v-btn
            v-if="!$vuetify.breakpoint.xsOnly"
            small
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload"
            :disabled="disabledTools"
          >
            <v-icon color="secondary" left>mdi-download</v-icon>Download JSON
          </v-btn>
          <v-btn small outlined color="secondary" @click="handleCopy" class="mr-1 btn--hover" :disabled="disabledTools">
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

        <v-btn-toggle v-model="currentViewIndex" mandatory class="mr-1">
          <v-tooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" small class="btn--hover" outlined color="secondary" @click="handleChangeView(index)">
                <v-icon color="secondary">{{ view.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ view.name }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-flex>
    </v-toolbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import useCopy from '@/core/composition/useCopy'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'
import { useRunVariablesStore } from '@/features/run-variables/useRunVariablesStore'

const copy = useCopy()
const router = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()
const runVariablesStore = useRunVariablesStore()

const { runId: uuid } = router.route.value.params

const views = [
  { name: 'Table', value: 'table', icon: 'mdi-table' },
  { name: 'JSON', value: 'json', icon: 'mdi-code-json' }
]

const defaultGroupByValues = [{ name: 'Name', value: 'name' }]

const currentView = ref(views[0])
const currentViewIndex = ref(0)
const currentGroupBy = ref(defaultGroupByValues[0])

const labels = computed(() => runVariablesStore.variablesLabels)
const items = computed(() => runVariablesStore.variables.results)
const variablesFullData = computed(() => runVariablesStore.variablesFullData)
const variablesJSON = computed(() => JSON.stringify(runVariablesStore.variablesJSON.results, null, 2))

// set labels to group select if they exist
const groupByValues = computed(() =>
  labels.value.length ? [...defaultGroupByValues, ...labels.value] : defaultGroupByValues
)

const disabledTools = computed(
  () =>
    (currentView.value.value === 'table' && !items.value.length) ||
    (currentView.value.value === 'json' && !variablesJSON.value)
)

const handleCopy = async () => {
  if (!variablesFullData.value) await runVariablesStore.getVariablesFullData({ uuid })

  copy.handleCopyText(variablesFullData.value)
}

const handleDownload = async () => {
  if (!variablesFullData.value) await runVariablesStore.getVariablesFullData({ uuid })

  forceFileDownload.trigger({ source: variablesFullData.value, name: `run_${uuid}_variables.json` })
}

const handleChangeView = (index: number) => {
  const view = views[index]
  currentViewIndex.value = index
  if (view.value === currentView.value.value) return
  currentView.value = view
  router.push({ name: `workspace-project-jobs-job-run-variables-${view.value}` })
}

onBeforeMount(() => {
  const view = router.route.value?.meta.tabValue
  if (view) {
    currentView.value = views.find(item => item.value === view)
  }
})
</script>
<style scoped>
.h-20 {
  height: 20px !important;
}
</style>
