<template>
  <v-card class="mx-auto" flat>
    <v-toolbar flat dense color="grey lighten-4" sticky-offset="{top: 48, bottom: 10}">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>

        <v-tooltip v-if="currentViewIndex" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              dark
              icon
              text
              small
              color="secondary"
              class="btn--hover btn--without-text mx-2"
              @click="handleFullScreen"
            >
              <v-icon>{{ isFullScreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
            </v-btn>
          </template>
          <span>{{ isFullScreen ? 'Exit full screen' : 'Full screen' }}</span>
        </v-tooltip>

        <v-btn-toggle v-model="currentViewIndex" mandatory class="mr-1">
          <v-tooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <v-btn
                small
                :tag="'a'"
                v-on="on"
                outlined
                color="secondary"
                class="btn--hover"
                :to="{ name: `workspace-project-jobs-job-runs-${view.value}` }"
              >
                <v-icon color="secondary">{{ view.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ view.name }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-flex>
    </v-toolbar>
    <router-view />
  </v-card>
</template>

<script setup lang="ts">
import { useMobileStore } from '@/core/store/useMobileStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, watch, computed, onBeforeUnmount } from '@vue/composition-api'
import { useCompareRunsStore } from '@/features/compare-runs/useCompareRunsStore'

const mobileStore = useMobileStore()
const { route } = useRouterAskAnna()
const compareRunsStore = useCompareRunsStore()

compareRunsStore.$reset()

const tabValue = computed(() => route?.value.meta?.tabValue)

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
  if (tabValue.value) {
    currentViewIndex.value = views.findIndex(el => el.value === tabValue.value) || 0
  }
}

watch(
  () => route.value.meta,
  () => init()
)

init()

onBeforeUnmount(() => (mobileStore.isFullScreen = false))
</script>
