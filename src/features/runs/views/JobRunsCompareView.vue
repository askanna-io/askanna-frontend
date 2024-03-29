<template>
  <AskAnnaLoadingProgress :loading="loading">
    <AskAnnaCard
      flat
      class="mx-auto mt-3"
    >
      <div
        ref="verticalScrollContainerRef"
        class="scroll-container"
        :style="scrollContainerStyle"
      >
        <CollapsibleSection
          open
          readonly
          class="sticky"
        >
          <ComparisonList>
            <template v-slot:title>
              <ComparisonListTitle :value="''" />
            </template>

            <ComparisonListItem
              v-for="(run, index) in compareRunsStore.runs.results"
              :key="index"
              :type="'run-suuid'"
              :value="run.suuid"
              :routeParams="{ runId: run.suuid }"
              to="workspace-project-jobs-job-run-overview"
            />
          </ComparisonList>
        </CollapsibleSection>

        <CollapsibleSection
          open
          :title="compareItems.overview.title"
        >
          <ComparisonList
            v-for="(item, index) in compareItems.overview.items"
            :key="index"
          >
            <template v-slot:title>
              <ComparisonListTitle
                :value="item.title"
                :isSubItem="item.isSubItem"
              />
            </template>

            <template v-if="!item.isMainGroup">
              <ComparisonListItem
                v-for="(run, index2) in compareRunsStore.runs.results"
                :to="item.to"
                :key="index2"
                :type="item.type"
                :class="item.class"
                :params="item.params"
                :value="get(run, item.field)"
                :routeParams="item.getRouteParams({
                  ...route.params,
                  runId: run.suuid
                })
                  "
              />
            </template>
          </ComparisonList>
        </CollapsibleSection>

        <CollapsibleSection
          noDataText="these runs don't have input"
          :title="compareItems.input.title"
          :disabled="!compareRunsStore.isInputExist"
        >
          <ComparisonList
            v-for="(item, index) in compareItems.input.items"
            :key="index"
          >
            <template v-slot:title>
              <ComparisonListTitle :value="item.title" />
            </template>

            <ComparisonListItem
              v-for="(run, index2) in compareRunsStore.runs.results"
              :key="index2"
              :type="item.type"
              :value="get(run, item.field)"
            />
          </ComparisonList>
        </CollapsibleSection>

        <CollapsibleSection
          open
          noDataText="these runs don't have a result"
          :title="compareItems.result.title"
          :disabled="!compareRunsStore.isResultExist || !compareItems.result.items.length"
        >
          <ComparisonList
            v-for="(item, index) in compareItems.result.items"
            :key="index"
          >
            <template v-slot:title>
              <ComparisonListTitle :value="item.title" />
            </template>

            <ComparisonListItem
              v-for="(run, index2) in compareRunsStore.runs.results"
              :to="item.to"
              :key="index2"
              :type="item.type"
              :value="get(run, item.field)"
              :routeParams="{ runId: run.suuid }"
            />
          </ComparisonList>
        </CollapsibleSection>

        <CollapsibleSection
          open
          :title="'Metrics'"
          noDataText="these runs don't have metrics"
          :disabled="!compareRunsStore.isMetricExist"
        >
          <template
            v-for="(item, index) in compareRunsStore.metrics"
            :key="index"
          >
            <ComparisonList :class="{ 'mb-0': isLabels }">
              <template v-slot:title>
                <ComparisonListTitle :value="item.metricName" />
              </template>

              <ComparisonListItem
                v-for="(metric, index2) in item.metric"
                :type="'metric'"
                :value="{ isLabels, metric }"
                :key="metric.name + index2 + index"
              />
            </ComparisonList>

            <template v-if="isLabels">
              <ComparisonList
                sticky
                :key="'labels' + index"
                class="labels"
              >
                <ComparisonListItem
                  sticky
                  :type="'label'"
                  :value="{
                    isLabels,
                    labels: item.label,
                    metricName: item.metricName
                  }"
                  :fullScreen="mobileStore.isFullScreen"
                />
              </ComparisonList>
              <AskAnnaDivider
                :key="'divider' + index"
                class="mb-2"
              />
            </template>
          </template>

          <AskAnnaButton
            v-if="compareRunsStore.metricParams.next.size && !compareRunsStore.metricParams.loadMetrics"
            class="ml-12"
            prependIcon="mdi-chevron-down"
            @click="handleShowMoreMetrics"
            :disabled="!compareRunsStore.metricParams.next.size"
          >
            Show more metrics
          </AskAnnaButton>
          <AskAnnaLoadingDotsFlashing
            v-if="compareRunsStore.metricParams.loadMetrics"
            inline
            class="ml-14"
          />
        </CollapsibleSection>

        <CollapsibleSection
          :title="'Variables'"
          noDataText="these runs don't have a  variable"
          :disabled="!compareRunsStore.isVariableExist"
        >
          <template
            v-for="(item, index) in compareRunsStore.variables"
            :key="'v' + index"
          >
            <ComparisonList :class="{ 'mb-0': isVariableLabels }">
              <template v-slot:title>
                <ComparisonListTitle :value="item.metricName" />
              </template>

              <ComparisonListItem
                v-for="(metric, index2) in item.metric"
                :type="'metric'"
                :value="{ isVariableLabels: true, metric }"
                :key="'v' + metric.name + index2 + index"
              />
            </ComparisonList>

            <template v-if="isVariableLabels">
              <ComparisonList
                sticky
                class="labels"
                :key="'vlabels' + index"
              >
                <ComparisonListItem
                  sticky
                  :type="'label'"
                  :value="{
                    isVariableLabels,
                    labels: item.label,
                    metricName: item.metricName
                  }"
                  :fullScreen="mobileStore.isFullScreen"
                />
              </ComparisonList>
              <AskAnnaDivider
                class="mb-2"
                :key="'vdivider' + index"
              />
            </template>
          </template>

          <AskAnnaButton
            v-if="compareRunsStore.variableParams.next.size && !compareRunsStore.variableParams.loadVariable"
            class="ml-12"
            prependIcon="mdi-chevron-down"
            @click="handleShowMoreVariables"
            :disabled="!compareRunsStore.variableParams.next.size"
          >
            Show more variables
          </AskAnnaButton>
          <AskAnnaLoadingDotsFlashing
            v-if="compareRunsStore.variableParams.loadVariable"
            inline
            class="ml-14"
          />
        </CollapsibleSection>

        <CollapsibleSection
          noDataText="these runs don't have an artifact"
          :title="compareItems.artifact.title"
          :disabled="!compareRunsStore.isArtifacExist"
        >
          <ComparisonList
            v-for="(item, index) in compareItems.artifact.items"
            :key="index"
          >
            <template v-slot:title>
              <ComparisonListTitle :value="item.title" />
            </template>

            <ComparisonListItem
              v-for="(run, index) in compareRunsStore.runs.results"
              :key="index"
              :to="item.to"
              :type="item.type"
              :params="item.params"
              :value="get(run, item.field)"
              :routeParams="item.getRouteParams({
                ...route.params,
                runId: run.suuid
              })
                "
            />
          </ComparisonList>
        </CollapsibleSection>
      </div>
    </AskAnnaCard>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
import { get } from 'lodash'
import { compareItems } from '@/features/compare-runs/helper'

const { height } = useWindowSize()
const mobileStore = useMobileStore()
const { route } = useRouterAskAnna()
const compareRunsStore = useCompareRunsStore()

const { jobId: suuid } = route.params

let loading = ref(true)
const currentScrollTop = ref(0)
const verticalScrollContainerRef = ref(null)

const isLabels = computed(() => Boolean(compareRunsStore.labels.length))
const scrollContainerStyle = computed(() => ({ height: `${height.value - 65}px` }))
const isVariableLabels = computed(() => Boolean(compareRunsStore.variableLabels.length))

const handleShowMoreMetrics = () => {
  compareRunsStore.loadMoreMetrics()
}

const handleShowMoreVariables = () => {
  compareRunsStore.loadMoreVariables()
}

const fetchData = async () => {
  loading.value = true

  await compareRunsStore.getRunsJob({
    suuid,
    params: {
      page_size: compareRunsStore.selectedCount
    }
  })

  loading.value = false
}

const handleOnScroll = () => {
  if (verticalScrollContainerRef.value.scrollTop > currentScrollTop.value) {
    currentScrollTop.value = verticalScrollContainerRef.value.scrollTop

    window.scrollTo(0, window.pageYOffset + 10)
  } else {
    currentScrollTop.value = 0
  }
}

watch(
  () => compareRunsStore.selectedCount,
  () => fetchData()
)

watch(verticalScrollContainerRef, scrollContainer => {
  if (!scrollContainer) return

  scrollContainer.onscroll = () => handleOnScroll()
})

onBeforeMount(() => fetchData())
</script>
<style scoped lang="scss">
.sticky {
  top: 0px;
  z-index: 4;
  position: sticky;
  background-color: white;
}

.scroll-container {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}

.section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;

  width: 100%;
  object-fit: cover;
  object-position: center;
}

.flex-col {
  width: 230px;
  display: flex;
  flex-direction: column;
}
</style>
