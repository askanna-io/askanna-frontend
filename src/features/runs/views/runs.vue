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
const mobileStore = useMobileStore()
const { route } = useRouterAskAnna()
const compareRunsStore = useCompareRunsStore()

compareRunsStore.$reset()

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