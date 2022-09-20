<template>
  <div>
    <div v-sticky="true" on-stick="onStick" sticky-offset="{top: 52, bottom: 10}">
      <v-toolbar v-if="sticked" ref="refToolbar" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs v-if="sticked" class="pl-0" :items="projectBreadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :exact="item.exact">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-toolbar>
      <v-card v-if="sticked" :class="{ 'ma-3': sticked }">
        <v-card-title transition="slide-y-transition">
          <v-toolbar dense color="white" flat class="br-r5">
            <project-menu :projectName="project.name" />
            <v-spacer />
          </v-toolbar>
        </v-card-title>
      </v-card>
    </div>

    <div class="askAnna-breadcrumbs" :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }">
      <v-breadcrumbs
        v-if="!sticked"
        :items="projectBreadcrumbs"
        :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }"
      >
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :exact="item.exact">
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>

    <v-divider />

    <v-card-title>
      <v-icon large left> mdi-semantic-web </v-icon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </v-card-title>

    <v-card-text class="ask-anna--editor" v-html="project.description" />
    <v-divider v-if="!sticked" />
    <v-card :flat="!sticked" :class="{ 'ma-3': sticked }">
      <v-slide-y-transition>
        <div v-if="!sticked">
          <v-toolbar dense color="white" flat class="br-r5 ma-3">
            <ProjectMenu :projectName="project.name" />
            <v-spacer />

            <ProjectMenuPopup :project="project" :routeToRedirect="'workspace'" />
          </v-toolbar>
        </div>
      </v-slide-y-transition>
    </v-card>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  project: {
    type: Object,
    default: function () {
      return {
        name: '',
        description: '',
        permission: {}
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
  handleOnStick: {
    type: Function,
    default: () => {}
  }
})

const refToolbar = ref(null)

const onStick = data => {
  props.handleOnStick(data.sticked)
}
</script>
