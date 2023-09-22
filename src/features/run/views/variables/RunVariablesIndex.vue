<template>
  <AskAnnaToolbar
    v-if="!disabledTools"
    flat
    class="z-10 askanna-sticky"
  >
    <div class="flex w-full items-center justify-between gap-2">
      <div class="cut-text flex items-center"></div>
      <div class="mr-auto flex items-center"></div>

      <div class="flex gap-2">
        <AskAnnaButton
          v-if="!$vuetify.display.xs"
          @click="handleScrollToTop()"
          prependIcon="mdi-arrow-up-bold"
        >
          Scroll to top
        </AskAnnaButton>
        <AskAnnaButton
          v-if="!$vuetify.display.xs"
          :disabled="disabledTools"
          prependIcon="mdi-download"
          @click="handleDownload"
        >
          Download JSON
        </AskAnnaButton>
        <AskAnnaButton
          :disabled="disabledTools"
          prependIcon="mdi-content-copy"
          @click="handleCopy"
        >
          Copy JSON
        </AskAnnaButton>
      </div>

      <AskAnnaBtnToggle
        divided
        mandatory
        color="primary"
        class="h-7 mr-2"
        :model-value="currentViewIndex"
      >
        <AskAnnaButtonIcon
          v-for="(view, index) in views"
          :key="index"
          class="border-main"
          @click="handleChangeView(index)"
        >
          <AskAnnaIcon :icon="view.icon" />
          <AskAnnaTooltip>
            {{ view.name }}
          </AskAnnaTooltip>
        </AskAnnaButtonIcon>
      </AskAnnaBtnToggle>
    </div>
  </AskAnnaToolbar>
  <RouterView />
</template>

<script setup lang="ts">
const copy = useCopy()
const { route, routerPush } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()
const runVariablesStore = useRunVariablesStore()

const { runId: suuid } = route.params

const views = [
  { name: 'Table', value: 'table', icon: 'mdi-table' },
  { name: 'JSON', value: 'json', icon: 'mdi-code-json' }
]

const currentView = ref(views[0])

const items = computed(() => runVariablesStore.variables?.results)
const variablesFullData = computed(() => runVariablesStore.variablesFullData)
const currentViewIndex = computed(() => views.findIndex(item => item.value === route.meta.tabValue))
const variablesJSON = computed(() => JSON.stringify(runVariablesStore.variablesJSON.results, null, 2))

const disabledTools = computed(
  () =>
    (currentView.value.value === 'table' && !items.value?.length) ||
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

const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  })
}

const handleChangeView = (index: number) => {
  const view = views[index]

  if (view.value === currentView.value.value) return
  routerPush({ name: `workspace-project-jobs-job-run-variables-${view.value}`, params: { ...route.params, view: currentView.value.value } })
  currentView.value = views[index]
}

const init = () => {
  if (route.meta.tabValue) {
    currentView.value = views.find(el => el.value === route.meta.tabValue) || views[0]
  }
}

init()
</script>
