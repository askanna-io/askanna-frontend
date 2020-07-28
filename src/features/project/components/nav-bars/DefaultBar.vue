<template>
  <div>
    <div v-sticky="true" on-stick="onStick" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" ref="refToolbar" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs v-if="sticked" class="pl-0" :items="projectBreadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" exact>
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-toolbar>
      <v-card v-if="sticked" :class="{ 'ma-3': sticked }">
        <v-card-title transition="slide-y-transition">
          <v-toolbar dense color="white" flat class="br-r5">
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
        </v-card-title>
      </v-card>
    </div>

    <v-card-title>
      <v-icon large left>
        mdi-semantic-web
      </v-icon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </v-card-title>

    <v-card-text class="font-weight-bold">
      {{ project.description }}
    </v-card-text>
    <v-divider v-if="!sticked" />
    <v-card :flat="!sticked" :class="{ 'ma-3': sticked }">
      <v-slide-y-transition>
        <div v-if="!sticked">
          <v-toolbar dense color="white" flat class="br-r5 ma-3">
            <v-tabs v-model="currentTab" left align-with-title>
              <v-tabs-slider color="primary" />
              <template v-for="tab of projectTools">
                <v-tab
                  v-if="tab.show"
                  ripple
                  :key="tab.id"
                  :to="{ name: tab.to, params: { title: `${tab.name} - ${project.name}`, ...routerParams } }"
                >
                  {{ tab.name }}
                </v-tab>
              </template>
            </v-tabs>

            <v-spacer />
          </v-toolbar>
        </div>
      </v-slide-y-transition>
    </v-card>
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
    },
    isShowProjectBar: {
      type: Boolean,
      default: false
    },
    sticked: {
      type: Boolean,
      default: false
    },
    handleShowProjectBar: {
      type: Function,
      default: () => {}
    },
    handleOnStick: {
      type: Function,
      default: () => {}
    }
  },

  setup(props, context) {
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
        to: 'workspace-project-code',
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
        show: context.root.isNotBeta
      }
    ]

    const onStick = data => {
      props.handleOnStick(data.sticked)
    }

    return { onStick, refToolbar, projectTools, currentTab, routerParams: context.root.$route.params }
  }
})
</script>
