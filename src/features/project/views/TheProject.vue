<template>
  <v-card class="mx-auto" outlined>
    <v-breadcrumbs :items="items">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" :disabled="item.disabled">
          {{ item.text.toUpperCase() }}
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

    <v-toolbar color="white" flat dense class="br-r5 mx-3">
      <v-tabs v-model="currentTab" left align-with-title>
        <v-tabs-slider color="primary" />

        <v-tab v-for="tab of projectTools" ripple :key="tab.id">
          {{ tab.name }}
        </v-tab>
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

    <v-tabs-items v-model="currentTab">
      <v-tab-item v-for="tab of projectTools" :key="tab.id">
        <component :is="tab.component" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import useProject from '../composition/useProject'

import Jobs from '../components/tabs/Jobs'
import Activity from '../components/tabs/Activity'
import Documantation from '../components/tabs/Documantation'

import { onBeforeMount } from '@vue/composition-api'

export default {
  name: 'TheProject',
  components: {
    Jobs,
    Activity,
    Documantation
  },

  setup(props, context) {
    const project = useProject()
  },

  data() {
    return {
      menu: false,
      projectView: 0,
      project: {
        name: 'Project title 1',
        id: 1,
        description:
          'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.'
      },
      items: [
        {
          text: 'Dashboard',
          disabled: false,
          to: '/'
        },
        {
          text: 'Workspaces',
          disabled: false,
          to: '/workspace/index'
        },
        {
          text: 'Project title 1',
          disabled: true,
          to: ''
        }
      ],
      currentTab: 0,
      projectTools: [
        {
          id: 0,
          name: 'Activity',
          component: 'Activity'
        },
        {
          id: 1,
          name: 'Jobs',
          component: 'Jobs'
        },

        {
          id: 2,
          name: 'Documantation',
          component: 'Documantation'
        }
      ]
    }
  }
}
</script>
