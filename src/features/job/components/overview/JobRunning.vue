<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Running the job</v-card-title>
    <v-row v-if="false">
      <v-col cols="12" sm="4">
        <v-select :items="versions" class="px-2" dense outlined persistent-hint label="Version" hint="Select package" />
      </v-col>
    </v-row>
    <v-row v-if="false">
      <v-col cols="12" sm="4">
        <v-text-field
          dense
          outlined
          label="Url"
          class="px-2"
          persistent-hint
          hint="Click to copy"
          value="workspaceName/projectName/jobName"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-toolbar dense color="white" class="br-r5" flat transition="slide-y-transition">
          <v-tabs v-model="currentTab" left align-with-title>
            <v-tabs-slider color="primary" />
            <template v-for="tab of tabs">
              <v-tab v-if="tab.show" ripple :key="tab.id">
                {{ tab.name }}
              </v-tab>
            </template>
          </v-tabs>
        </v-toolbar>
      </v-col>
      <v-col cols="12">
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

<script>
import JobRunCurl from './jobrunning/JobRunCurl'
import JobRunPython from './jobrunning/JobRunPython'
import JobRunPlatform from './jobrunning/JobRunPlatform'
import { ref, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunning',

  components: {
    JobRunCurl,
    JobRunPython,
    JobRunPlatform
  },

  setup(_, context) {
    const versions = ['package v1', 'package v2']
    const currentTab = ref('workspace-project-job-running-curl')

    const tabs = [
      {
        id: 0,
        name: 'Platform',
        component: 'JobRunPlatform',
        to: 'workspace-project-job-running-platform',
        show: true
      },
      {
        id: 1,
        name: 'Curl',
        component: 'JobRunCurl',
        to: 'workspace-project-job-running-curl',
        show: true
      },
      {
        id: 2,
        name: 'Python',
        component: 'JobRunPython',
        to: 'workspace-project-job-running-python',
        show: true
      }
    ]

    return {
      tabs,
      versions,
      currentTab
    }
  }
})
</script>
