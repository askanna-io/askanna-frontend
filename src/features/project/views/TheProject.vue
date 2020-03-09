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
import Jobs from '../components/tabs/Jobs'
import Code from '../components/tabs/Code'
import Activity from '../components/tabs/Activity'
import useProject from '../composition/useProject'
import { onBeforeMount } from '@vue/composition-api'
import Documantation from '../components/tabs/Documantation'

export default {
  name: 'TheProject',

  components: {
    Jobs,
    Code,
    Activity,
    Documantation
  },

  setup(props, context) {
    const project = useProject()
  },

  data() {
    return {
      stickedVal: false,
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
          name: 'Code',
          component: 'Code'
        },
        {
          id: 2,
          name: 'Jobs',
          component: 'Jobs'
        },

        {
          id: 3,
          name: 'Documantation',
          component: 'Documantation'
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
