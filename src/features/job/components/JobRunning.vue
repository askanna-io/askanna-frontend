<template>
  <v-card class="mx-auto" flat>
    <v-card-title>Runnig the job:</v-card-title>
    <v-row>
      <v-col cols="12" sm="4">
        <v-select :items="versions" class="px-2" dense outlined persistent-hint label="Version" hint="Select package" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          dense
          outlined
          label="Url"
          class="px-2"
          persistent-hint
          hint="Click to copy"
          value="Grocery delivery"
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
          <v-tab-item v-for="tab in tabs" :key="tab.name">
            <component :is="tab.component" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import JobRunPortal from './overview/jobrunning/JobRunPortal'
import { ref, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunnig',

  components: {
    JobRunPortal
  },

  setup(rops, context) {
    const versions = ['package v1', 'package v2']
    const currentTab = ref('workspace-project-activity')

    const tabs = [
      {
        id: 0,
        name: 'Portal',
        component: 'JobRunPortal',
        to: 'workspace-project-job-runnig-portal',
        show: !context.root.isNotBeta
      },
      {
        id: 1,
        name: 'Curl',
        to: 'workspace-project-job-runnig-curl',
        show: !context.root.isNotBeta
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
