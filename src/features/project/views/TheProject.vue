<template>
  <v-card class="mx-auto" outlined>
    <v-breadcrumbs :items="breadcrumbs">
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

        <v-menu v-if="true" bottom right>
          <template v-slot:activator="{ on }">
            <v-btn text class="align-self-center mr-4" v-on="on">
              PROJECTS MENU
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list class="grey lighten-3">
            <v-list-item
              v-for="tab in projectTools"
              :key="tab.id"
              :to="{ name: tab.to, params: { title: `${tab.name} - ${project.name}` } }"
            >
              {{ tab.name }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-tabs>

      <v-spacer />

      <v-menu bottom color="primary" :close-on-content-click="false" :nudge-width="200" offset-x>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" color="primary">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>Admin / Config</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Advanced options</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <router-view />
  </v-card>
</template>

<script>
import useProject from '../composition/useProject'
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'

export default {
  name: 'TheProject',

  setup(props, context) {
    const project = useProject(context)
    const end = context.root.$route.name.indexOf('jobs-name') >= 1 ? 5 : 3
    const breadcrumbs = useBreadcrumbs(context, { start: 0, end })

    return { ...project, breadcrumbs }
  },

  data() {
    return {
      stickedVal: false,
      menu: false,
      projectView: 0,

      currentTab: 'workspace-project-activity',
      projectTools: [
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
    }
  },

  computed: {
    sticked: {
      get() {
        return this.stickedVal
      },
      set(val) {
        this.stickedVal = val
      }
    }
  },
  methods: {
    onStick(data) {
      this.sticked = data.sticked
    }
  }
}
</script>
