<template>
  <v-card class="mx-auto" flat>
    <v-card-title :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }">Running the job</v-card-title>
    <v-row>
      <v-col cols="12" :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">
        <v-toolbar dense color="white" class="br-r5" flat transition="slide-y-transition">
          <v-tabs v-model="currentTab" left :align-with-title="!$vuetify.breakpoint.xsOnly">
            <v-tabs-slider color="primary" />
            <template v-for="tab of tabs">
              <v-tab v-if="tab.show" ripple :key="tab.id">
                {{ tab.name }}
              </v-tab>
            </template>
          </v-tabs>
        </v-toolbar>
      </v-col>
      <v-col cols="12" :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">
        <v-tabs-items v-model="currentTab">
          <template v-for="tab in tabs">
            <v-tab-item :key="tab.name" v-if="tab.show">
              <component :is="tab.component" />
            </v-tab-item>
          </template>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import RunCurl from './run/RunCurl.vue'
import RunPython from './run/RunPython.vue'
import RunPlatform from './run/RunPlatform.vue'

const currentTab = ref('workspace-project-job-running-curl')

const tabs = [
  {
    id: 0,
    name: 'Platform',
    component: RunPlatform,
    to: 'workspace-project-job-running-platform',
    show: true
  },
  {
    id: 1,
    name: 'Curl',
    component: RunCurl,
    to: 'workspace-project-job-running-curl',
    show: true
  },
  {
    id: 2,
    name: 'Python',
    component: RunPython,
    to: 'workspace-project-job-running-python',
    show: true
  }
]
</script>
