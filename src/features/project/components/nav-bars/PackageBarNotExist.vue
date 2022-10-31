<template>
  <div>
    <div v-sticky="true" on-stick="onStick" sticky-offset="{top: 52, bottom: 10}">
      <AskAnnaToolbar v-if="sticked" ref="refToolbar" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <v-breadcrumbs v-if="sticked" class="pl-0" :items="projectBreadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :to="item.to" :exact="item.exact">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </AskAnnaToolbar>
      <AskAnnaCard v-if="sticked" :class="{ 'ma-3': sticked }">
        <AskAnnaCardTitle transition="slide-y-transition">
          <AskAnnaToolbar dense color="white" flat class="br-r5">
            <project-menu :projectName="project.name" />
            <AskAnnaSpacer />
          </AskAnnaToolbar>
        </AskAnnaCardTitle>
      </AskAnnaCard>
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

    <AskAnnaDivider />

    <AskAnnaCardTitle>
      <AskAnnaIcon large left> mdi-semantic-web </AskAnnaIcon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </AskAnnaCardTitle>

    <AskAnnaCardText class="ask-anna--editor" v-html="project.description" />
    <AskAnnaDivider v-if="!sticked" />
    <AskAnnaCard :flat="!sticked" :class="{ 'ma-3': sticked }">
      <AskAnnaSlideYTransition>
        <div v-if="!sticked">
          <AskAnnaToolbar dense color="white" flat class="br-r5 ma-3">
            <ProjectMenu :projectName="project.name" />
            <AskAnnaSpacer />

            <ProjectMenuPopup :project="project" :routeToRedirect="'workspace'" />
          </AskAnnaToolbar>
        </div>
      </AskAnnaSlideYTransition>
    </AskAnnaCard>
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
