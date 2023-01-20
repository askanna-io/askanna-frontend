<template>
  <AskAnnaCard class="mx-auto" flat>
    <AskAnnaToolbar flat dense color="grey lighten-4" sticky-offset="{top: 48, bottom: 10}">
      <AskAnnaFlex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>

        <AskAnnaTooltip v-if="currentViewIndex" top>
          <template v-slot:activator="{ on }">
            <AskAnnaButton
              v-on="on"
              dark
              icon
              text
              small
              color="secondary"
              class="btn--hover btn--without-text mx-2"
              @click="handleFullScreen"
            >
              <AskAnnaIcon>{{ isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</AskAnnaIcon>
            </AskAnnaButton>
          </template>
          <span>{{ isFullScreen ? 'Exit full screen' : 'Full screen' }}</span>
        </AskAnnaTooltip>

        <VBtnToggle v-model="currentViewIndex" mandatory class="mr-1">
          <AskAnnaTooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                small
                :tag="'a'"
                v-on="on"
                outlined
                color="secondary"
                class="btn--hover"
                :to="{ name: `workspace-project-jobs-job-runs-${view.value}` }"
              >
                <AskAnnaIcon color="secondary">{{ view.icon }}</AskAnnaIcon>
              </AskAnnaButton>
            </template>
            <span>{{ view.name }}</span>
          </AskAnnaTooltip>
        </VBtnToggle>
      </AskAnnaFlex>
    </AskAnnaToolbar>
    <RouterView />
  </AskAnnaCard>
</template>

<script setup lang="ts">
const mobileStore = useMobileStore()
const { route } = useRouterAskAnna()
const compareRunsStore = useCompareRunsStore()

const tabValue = computed(() => route?.meta?.tabValue)

const views = [
  { name: 'Table', value: 'table', icon: 'mdi-table' },
  { name: 'Compare', value: 'compare', icon: 'mdi-format-columns' }
]

const currentViewIndex = ref(0)
const isFullScreen = ref(false)

const handleFullScreen = () => {
  mobileStore.isFullScreen = !mobileStore.isFullScreen
}

const init = async () => {
  await compareRunsStore.$reset()

  if (tabValue.value) {
    currentViewIndex.value = views.findIndex(el => el.value === tabValue.value) || 0
  }
}

watch(
  () => route.meta,
  () => init()
)

init()

onBeforeUnmount(() => (mobileStore.isFullScreen = false))
</script>
