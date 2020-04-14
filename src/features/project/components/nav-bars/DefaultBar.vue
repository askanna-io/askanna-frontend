<template>
  <div>
    <v-breadcrumbs :items="projectBreadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" exact>
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-divider />
    <v-card-title>
      <v-icon large left>
        mdi-semantic-web
      </v-icon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </v-card-title>

    <v-card-text class="font-weight-bold">
      {{ project.description }}
    </v-card-text>
    <v-divider />
    <v-toolbar
      color="white"
      class="br-r5 ma-3"
      dense
      :flat="!sticked"
      on-stick="onStick"
      sticky-container
      v-sticky="true"
      sticky-offset="{top: 52, bottom: 10}"
    >
      <v-tabs v-model="currentTab" left align-with-title>
        <v-tabs-slider color="primary" />

        <v-tab
          v-for="tab of projectTools"
          ripple
          :key="tab.id"
          :to="{ name: tab.to, params: { title: `${tab.name} - ${project.name}` } }"
        >
          {{ tab.name }}
        </v-tab>
      </v-tabs>

      <v-spacer />
    </v-toolbar>
  </div>
</template>
<script>
import { createComponent, onBeforeMount, computed, watch, ref } from '@vue/composition-api'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

export default createComponent({
  name: 'DefaultBar',

  props: {
    project: {
      type: Object,
      default: function() {
        return {
          name: ''
        }
      }
    },
    projectBreadcrumbs: {
      type: Array,
      default: []
    }
  },

  setup(props, context) {
    let sticked = ref(false)

    const currentTab = ref('workspace-project-activity')
    const projectTools = [
      {
        id: 0,
        name: 'Activity',
        to: 'workspace-project-activity'
      },
      {
        id: 1,
        name: 'Code',
        to: 'workspace-project-packages'
      },
      {
        id: 2,
        name: 'Jobs',
        to: 'workspace-project-jobs'
      },

      {
        id: 3,
        name: 'Documentation',
        to: 'workspace-project-documentation'
      }
    ]

    const onStick = data => {
      sticked = data.sticked
    }

    return { sticked, projectTools, currentTab }
  }
})
</script>
