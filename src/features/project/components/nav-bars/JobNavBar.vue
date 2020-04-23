<template>
  <div>
    <v-toolbar
      dense
      color="white"
      v-sticky="true"
      class="br-r5 ma-3"
      on-stick="onStick"
      sticky-offset="{top: 52, bottom: 10}"
      :flat="!sticked"
    >
      <v-btn
        text
        icon
        class="align-self-center mr-4"
        :color="(isShowProjectBar && 'primary') || ''"
        @click="isShowProjectBar = !isShowProjectBar"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-spacer />
    </v-toolbar>
    <v-divider />
    <v-slide-y-transition>
      <v-toolbar v-if="isShowProjectBar" dense color="white" class="br-r5 ma-3" flat transition="slide-y-transition">
        <v-tabs left align-with-title>
          <v-tabs-slider color="primary" optional />
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
      </v-toolbar>
    </v-slide-y-transition>
    <v-divider />

    <v-card-title>
      <span class="title font-weight-light">Job: {{ job.name }}</span>
      <v-tabs v-model="currentTab" left align-with-title>
        <v-tabs-slider color="primary" />

        <v-tab
          v-for="tab of jobTools"
          :key="tab.id"
          ripple
          :to="{ name: tab.to, params: { title: `${tab.name} - ${project.name}` } }"
        >
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </v-card-title>
  </div>
</template>
<script>
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import { defineComponent, onBeforeMount, computed, watch, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'JobNavBar',

  props: {
    job: {
      type: Object,
      default: function() {
        return {
          name: ''
        }
      }
    },
    project: {
      type: Object,
      default: function() {
        return {
          name: ''
        }
      }
    }
  },

  setup(props, context) {
    const currentProjectTab = ref('')
    const isShowProjectBar = ref(false)
    const end = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end: 5 })

    let sticked = ref(false)

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

    const currentTab = ref('job-overview')
    const jobTools = [
      {
        id: 0,
        name: 'Overview',
        to: 'workspace-project-job-overiew'
      },
      {
        id: 1,
        name: 'Runs',
        to: 'workspace-project-job-jobruns'
      },
      {
        id: 2,
        name: 'Variables & data',
        to: 'workspace-project-job-variables'
      },

      {
        id: 3,
        name: 'Tokens',
        to: 'workspace-project-job-tokens'
      }
    ]

    const onStick = data => {
      sticked = data.sticked
    }
    return {
      sticked,
      onStick,
      jobTools,
      currentTab,
      breadcrumbs,
      isShowProjectBar,
      currentProjectTab,
      projectTools: projectTools.filter(item => item.show)
    }
  }
})
</script>
