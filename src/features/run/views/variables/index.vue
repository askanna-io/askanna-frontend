<template>
  <div>
    <AskAnnaToolbar v-if="!disabledTools" flat dense color="grey lighten-4" sticky-offset="{top: 48, bottom: 10}">
      <AskAnnaFlex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>

        <div>
          <AskAnnaButton
            v-if="!$vuetify.breakpoint.xsOnly"
            small
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload"
            :disabled="disabledTools"
          >
            <AskAnnaIcon color="secondary" left>mdi-download</AskAnnaIcon>Download JSON
          </AskAnnaButton>
          <AskAnnaButton
            small
            outlined
            color="secondary"
            @click="handleCopy"
            class="mr-1 btn--hover"
            :disabled="disabledTools"
          >
            <AskAnnaIcon color="secondary" left>mdi-content-copy</AskAnnaIcon>Copy JSON
          </AskAnnaButton>
        </div>

        <AskAnnaCard class="ml-4" flat width="175" color="grey lighten-4" v-if="false">
          <AskAnnaSelect
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
          </AskAnnaSelect>
        </AskAnnaCard>

        <v-btn-toggle v-model="currentViewIndex" mandatory class="mr-1">
          <AskAnnaTooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                v-on="on"
                small
                class="btn--hover"
                outlined
                color="secondary"
                @click="handleChangeView(index)"
              >
                <AskAnnaIcon color="secondary">{{ view.icon }}</AskAnnaIcon>
              </AskAnnaButton>
            </template>
            <span>{{ view.name }}</span>
          </AskAnnaTooltip>
        </v-btn-toggle>
      </AskAnnaFlex>
    </AskAnnaToolbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
const copy = useCopy()
const { route, router } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()
const runVariablesStore = useRunVariablesStore()

const { runId: suuid } = route.params

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
  if (!variablesFullData.value) await runVariablesStore.getVariablesFullData({ suuid })

  copy.handleCopyText(variablesFullData.value)
}

const handleDownload = async () => {
  if (!variablesFullData.value) await runVariablesStore.getVariablesFullData({ suuid })

  forceFileDownload.trigger({ source: variablesFullData.value, name: `run_${suuid}_variables.json` })
}

const handleChangeView = (index: number) => {
  const view = views[index]
  currentViewIndex.value = index
  if (view.value === currentView.value.value) return
  currentView.value = view
  router.push({ name: `workspace-project-jobs-job-run-variables-${view.value}` })
}

onBeforeMount(() => {
  const view = route.meta.tabValue
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
