<template>
  <div>
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
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn text icon class="align-self-center mr-4" v-on="on">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-flex mx-3><h4>Projects menu:</h4></v-flex>
          <v-divider />
          <v-list-item
            v-for="tab in projectTools"
            :key="tab.id"
            :to="{ name: tab.to, params: { title: `${tab.name} - ${project.name}` } }"
          >
            {{ tab.name }}
          </v-list-item>
        </v-list>
      </v-menu>
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
import { createComponent, onBeforeMount, computed, watch, ref } from '@vue/composition-api'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

export default createComponent({
  name: 'JobNavBar',

  props: {
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
    const end = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const breadcrumbs = useBreadcrumbs(context, { start: 1, end: 5 })

    let sticked = ref(false)

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

    const job = {
      name: 'test'
    }

    return { job, breadcrumbs, sticked, projectTools, currentTab, jobTools }
  }
})
</script>
