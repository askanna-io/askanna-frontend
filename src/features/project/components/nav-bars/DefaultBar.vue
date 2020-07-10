<template>
  <div>
    <div v-sticky="true" on-stick="onStick" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar ref="refToolbar" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs :items="projectBreadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" exact>
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-toolbar>
    </div>

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
    <v-toolbar dense color="white" flat class="br-r5 ma-3">
      <v-tabs v-model="currentTab" left align-with-title>
        <v-tabs-slider color="primary" />
        <template v-for="tab of projectTools">
          <v-tab
            v-if="tab.show"
            ripple
            :key="tab.id"
            :to="{ name: tab.to, params: { title: `${tab.name} - ${project.name}` } }"
          >
            {{ tab.name }}
          </v-tab>
        </template>
      </v-tabs>

      <v-spacer />
    </v-toolbar>
  </div>
</template>
<script>
import { ref, defineComponent } from '@vue/composition-api'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

export default defineComponent({
  name: 'DefaultBar',

  props: {
    project: {
      type: Object,
      default: function () {
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
    const refToolbar = ref(null)

    const currentTab = ref('workspace-project-activity')
    const projectTools = [
      {
        id: 0,
        name: 'Activity',
        to: 'workspace-project-activity',
        show: context.root.isNotBeta
      },
      {
        id: 1,
        name: 'Code',
        to: 'workspace-project-packages',
        show: !context.root.isNotBeta
      },
      {
        id: 2,
        name: 'Jobs',
        to: 'workspace-project-jobs',
        show: !context.root.isNotBeta
      },

      {
        id: 3,
        name: 'Documentation',
        to: 'workspace-project-documentation',
        show: !context.root.isNotBeta
      }
    ]

    const onStick = data => {
      sticked.value = data.sticked
    }

    return { sticked, onStick, refToolbar, projectTools, currentTab }
  }
})
</script>
