<template>
  <AskAnnaLoadingProgress :type="'table-row'" :loading="loading">
    <v-card class="mx-auto mt-3" flat>
      <div ref="verticalScrollContainerRef" class="scroll-container" :style="scrollContainerStyle">
        <CollapsibleSection open readonly class="sticky">
          <ComparisonList>
            <template v-slot:title><ComparisonListTitle :value="''" /></template>

            <ComparisonListItem
              v-for="(run, index) in compareRunsStore.runs.results"
              :key="index"
              :type="'run-suuid'"
              :value="run.short_uuid"
              :routeParams="{ runId: run.short_uuid }"
              to="workspace-project-jobs-job-run-overview"
            />
          </ComparisonList>
        </CollapsibleSection>

        <CollapsibleSection open :title="compareItems.overview.title">
          <ComparisonList v-for="(item, index) in compareItems.overview.items" :key="index">
            <template v-slot:title><ComparisonListTitle :value="item.title" :isSubItem="item.isSubItem" /></template>

            <template v-if="!item.isMainGroup">
              <template v-for="(run, index2) in compareRunsStore.runs.results">
                <ComparisonListItem
                  :to="item.to"
                  :key="index2"
                  :type="item.type"
                  :class="item.class"
                  :params="item.params"
                  :value="get(run, item.field)"
                  :routeParams="
                    item.getRouteParams({
                      ...route.params,
                      runId: run.short_uuid
                    })
                  "
                />
              </template>
            </template>
          </ComparisonList>
        </CollapsibleSection>

        <CollapsibleSection
          noDataText="these runs don't have input"
          :title="compareItems.input.title"
          :disabled="!compareRunsStore.isInputExist"
        >
          <ComparisonList v-for="(item, index) in compareItems.input.items" :key="index">
            <template v-slot:title><ComparisonListTitle :value="item.title" /></template>

            <ComparisonListItem
              v-for="(run, index2) in compareRunsStore.runs.results"
              :key="index2"
              :type="item.type"
              :value="get(run, item.field)"
            /> </ComparisonList
        ></CollapsibleSection>

        <CollapsibleSection
          open
          noDataText="these runs don't have a result"
          :title="compareItems.result.title"
          :disabled="!compareRunsStore.isResultExist"
        >
          <ComparisonList v-for="(item, index) in compareItems.result.items" :key="index">
            <template v-slot:title><ComparisonListTitle :value="item.title" /></template>

            <ComparisonListItem
              v-for="(run, index2) in compareRunsStore.runs.results"
              :key="index2"
              :type="item.type"
              :value="get(run, item.field)" /></ComparisonList
        ></CollapsibleSection>

        <CollapsibleSection
          open
          :title="'Metrics'"
          noDataText="these runs don't have metrics"
          :disabled="!compareRunsStore.isMetricExist"
        >
          <template v-for="(item, index) in compareRunsStore.metrics">
            <ComparisonList :key="index" :class="{ 'mb-0': isLabels }">
              <template v-slot:title><ComparisonListTitle :value="item.metricName" /></template>

              <ComparisonListItem
                v-for="(metric, index2) in item.metric"
                :type="'metric'"
                :value="{ isLabels, metric }"
                :key="metric.name + index2 + index"
              />
            </ComparisonList>

            <template v-if="isLabels">
              <ComparisonList sticky :key="'labels' + index" class="labels">
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
              <v-divider :key="'divider' + index" class="mb-2" />
            </template>
          </template>

          <v-btn
            v-if="compareRunsStore.metricParams.next && !compareRunsStore.metricParams.loadMetrics"
            small
            outlined
            color="secondary"
            class="ml-15 btn--hover"
            @click="handleShowMoreMetrics"
            :disabled="!compareRunsStore.metricParams.next"
          >
            <v-icon color="secondary" left>mdi-chevron-down</v-icon>Show more metrics
          </v-btn>
          <AskAnnaLoadingDotsFlashing v-if="compareRunsStore.metricParams.loadMetrics" inline class="ml-14" />
        </CollapsibleSection>

        <CollapsibleSection
          :title="'Variables'"
          noDataText="these runs don't have a  variable"
          :disabled="!compareRunsStore.isVariableExist"
        >
          <template v-for="(item, index) in compareRunsStore.variables">
            <ComparisonList :key="'v' + index" :class="{ 'mb-0': isVariableLabels }">
              <template v-slot:title><ComparisonListTitle :value="item.metricName" /></template>

              <ComparisonListItem
                v-for="(metric, index2) in item.metric"
                :type="'metric'"
                :value="{ isVariableLabels: true, metric }"
                :key="'v' + metric.name + index2 + index"
              />
            </ComparisonList>

            <template v-if="isVariableLabels">
              <ComparisonList sticky :key="'vlabels' + index" class="labels">
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
              <v-divider :key="'vdivider' + index" class="mb-2" />
            </template>
          </template>

          <v-btn
            v-if="compareRunsStore.variableParams.next && !compareRunsStore.variableParams.loadVariable"
            small
            outlined
            color="secondary"
            class="ml-15 btn--hover"
            @click="handleShowMoreMetrics"
            :disabled="!compareRunsStore.variableParams.next"
          >
            <v-icon color="secondary" left>mdi-chevron-down</v-icon>Show more variables
          </v-btn>
          <AskAnnaLoadingDotsFlashing v-if="compareRunsStore.variableParams.loadVariable" inline class="ml-14" />
        </CollapsibleSection>

        <CollapsibleSection
          noDataText="these runs don't have an artifact"
          :title="compareItems.artifact.title"
          :disabled="!compareRunsStore.isArtifacExist"
        >
          <ComparisonList v-for="(item, index) in compareItems.artifact.items" :key="index">
            <template v-slot:title><ComparisonListTitle :value="item.title" /></template>

            <ComparisonListItem
              v-for="(run, index) in compareRunsStore.runs.results"
              :key="index"
              :type="item.type"
              :value="get(run, item.field)"
            /> </ComparisonList
        ></CollapsibleSection>
      </div>
    </v-card>
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
import { get } from 'lodash'
import { useWindowSize } from '@/core/plugins/vue-hooks'
import { useMobileStore } from '@/core/store/useMobileStore'
import { compareItems } from '@/features/compare-runs/helper'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, watch, computed, onBeforeMount } from '@vue/composition-api'
import { useCompareRunsStore } from '@/features/compare-runs/useCompareRunsStore'
import ComparisonList from '@/features/compare-runs/components/ComparisonList.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'
import CollapsibleSection from '@/features/compare-runs/components/CollapsibleSection.vue'
import ComparisonListItem from '@/features/compare-runs/components/ComparisonListItem.vue'
import ComparisonListTitle from '@/features/compare-runs/components/ComparisonListTitle.vue'
import AskAnnaLoadingDotsFlashing from '@/core/components/shared/AskAnnaLoadingDotsFlashing.vue'

const { height } = useWindowSize()
const mobileStore = useMobileStore()
const { route } = useRouterAskAnna()
const compareRunsStore = useCompareRunsStore()

const { jobId: uuid } = route.value.params

let loading = ref(true)
const currentScrollTop = ref(0)
const verticalScrollContainerRef = ref(null)

const isLabels = computed(() => Boolean(compareRunsStore.labels.length))
const scrollContainerStyle = computed(() => ({ height: `${height.value - 65}px` }))
const isVariableLabels = computed(() => Boolean(compareRunsStore.variableLabels.length))

const handleShowMoreMetrics = () => {
  compareRunsStore.loadMoreMetrics()
}

const fetchData = async () => {
  loading.value = true

  await compareRunsStore.getRunsJob({
    uuid,
    params: {
      limit: compareRunsStore.selectedCount,
      offset: 0
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
  position: sticky;
  top: 0px;
  background-color: white;
  z-index: 4;
}
.scroll-container {
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}

.section {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;

  object-fit: cover;
  object-position: center;
  width: 100%;
}

.flex-column {
  display: flex;
  flex-direction: column;
  width: 230px;
}
</style>
