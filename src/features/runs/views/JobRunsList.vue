<template>
  <AskAnnaCard
    flat
    class="mx-auto"
  >
    <AskAnnaToolbar flat>
      <div class="flex w-full items-center justify-between">
        <div class="sm:w-9/12 md:w-6/12 xl:w-4/12">
        </div>
        <div class="flex items-center justify-end sm:w-9/12 md:w-6/12 xl:w-4/12 text-end">
          <AskAnnaButtonIconSquare
            v-if="currentViewIndex"
            @click="handleFullScreen"
            :icon="mobileStore.isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
          >
            <AskAnnaTooltip>
              <span>{{ mobileStore.isFullScreen ? 'Exit full screen' : 'Full screen' }}</span>
            </AskAnnaTooltip>
          </AskAnnaButtonIconSquare>

          <AskAnnaBtnToggle
            class="p-2 h-11 cursor-pointer"
            :model-value="currentViewIndex"
          >
            <AskAnnaButtonIcon
              v-for="(view, index) in views"
              :tag="'a'"
              :key="index"
              class="border-main"
              :to="{ name: `workspace-project-jobs-job-runs-${view.value}`, params: route.params }"
            >
              <AskAnnaIcon :icon="view.icon" />
              <AskAnnaTooltip>
                {{ view.name }}
              </AskAnnaTooltip>
            </AskAnnaButtonIcon>
          </AskAnnaBtnToggle>
        </div>
      </div>
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
