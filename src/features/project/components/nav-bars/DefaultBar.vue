<template>
  <div>
    <div v-sticky="true" on-stick="onStick" sticky-offset="{top: 52, bottom: 10}">
      <AskAnnaToolbar v-if="sticked" ref="refToolbar" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <div class="askAnna-breadcrumbs">
          <VBreadcrumbs v-if="sticked" class="pl-0" :items="projectBreadcrumbs">
            <template v-slot:item="{ item }">
              <VBreadcrumbsItem :to="item.to" :exact="item.exact">
                {{ item.title }}
              </VBreadcrumbsItem>
            </template>
          </VBreadcrumbs>
        </div>
      </AskAnnaToolbar>
      <AskAnnaCard v-if="sticked" :class="{ 'ma-3': sticked }">
        <AskAnnaCardTitle transition="slide-y-transition">
          <AskAnnaToolbar dense color="white" flat class="br-r5">
            <ProjectMenu :projectName="project.name" :isEditProjectView="isEditProjectView" />
            <AskAnnaSpacer />
          </AskAnnaToolbar>
        </AskAnnaCardTitle>
      </AskAnnaCard>
    </div>
    <div class="askAnna-breadcrumbs" :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }">
      <VBreadcrumbs
        v-if="!sticked"
        class="pl-4"
        :items="projectBreadcrumbs"
        :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" :exact="item.exact">
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </div>
    <AskAnnaDivider v-if="!isEditProjectView && !$vuetify.breakpoint.xsOnly" />

    <AskAnnaCardTitle v-if="!isEditProjectView" :class="{ 'py-1 pl-3 ': $vuetify.breakpoint.xsOnly }">
      <AskAnnaIcon large left> mdi-semantic-web </AskAnnaIcon>
      <span class="title font-weight-light">{{ project.name }}</span>
    </AskAnnaCardTitle>
    <AskAnnaDescription
      v-if="!isEditProjectView && project.description !== '<p></p>'"
      readonly
      :description="project.description"
      :class="{ 'py-0 pl-2 ': $vuetify.breakpoint.xsOnly }" />
    <AskAnnaDivider v-if="!sticked && !$vuetify.breakpoint.xsOnly" />
    <AskAnnaCard :flat="!sticked" :class="{ 'ma-3': sticked }">
      <AskAnnaSlideYTransition>
        <div v-if="!sticked">
          <AskAnnaToolbar
            dense
            flat
            color="white"
            class="ml-4"
            :class="{ 'br-r5 ma-3': !$vuetify.breakpoint.xsOnly, 'ma-0 with-tabs': $vuetify.breakpoint.xsOnly }">
            <ProjectMenu :projectName="project.name" :isEditProjectView="isEditProjectView" />
            <AskAnnaSpacer />
            <ProjectMenuPopup
              v-if="!isEditProjectView && (projectRemove || projectInfoEdit)"
              :project="project"
              :routeToRedirect="'workspace'"
              :routeBackTo="'workspace-project'" />
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
    default: () => { }
  }
})

const refToolbar = ref(null)
const permission = usePermission()
const { route } = useRouterAskAnna()

const projectRemove = computed(() => permission.getFor(permission.labels.projectRemove))
const projectInfoEdit = computed(() => permission.getFor(permission.labels.projectInfoEdit))

const onStick = data => {
  props.handleOnStick(data.sticked)
}

const isEditProjectView = computed(() => route.name === 'workspace-project-edit')
</script>
<style lang="scss">
.mobile-view {
  .askAnna-breadcrumbs {
    width: 100%;
    height: 20px;
    overflow: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .v-breadcrumbs {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 15px;
      margin-bottom: 15px;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
