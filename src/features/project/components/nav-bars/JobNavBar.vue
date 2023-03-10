<template>
  <div>
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <AskAnnaToolbar v-if="sticked" dense color="white" class="br-r5 ma-3 askAnna-breadcrumbs" :flat="!sticked">
        <VBreadcrumbs :items="breadcrumbs" class="pl-0" :class="{ 'ma-0 pa-0': $vuetify.breakpoint.xsOnly }">
          <template v-slot:item="{ item }">
            <VBreadcrumbsItem :to="item.to" :exact="item.exact">
              {{ item.title }}
            </VBreadcrumbsItem>
          </template>
        </VBreadcrumbs>
        <AskAnnaSpacer />
      </AskAnnaToolbar>

      <AskAnnaCard :flat="!sticked" v-if="sticked" :class="{ 'ma-3': sticked }">
        <AskAnnaDivider v-if="!sticked" />
        <AskAnnaSlideYTransition>
          <ProjectToolBar v-if="sticked" :projectName="project.name" />
        </AskAnnaSlideYTransition>
        <AskAnnaSlideYTransition>
          <AskAnnaDivider v-if="sticked" />
        </AskAnnaSlideYTransition>
        <JobToolBar :jobName="job.name" :projectName="project.name" />
      </AskAnnaCard>
    </div>
    <div class="askAnna-breadcrumbs" :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }">
      <VBreadcrumbs v-if="!sticked" :items="breadcrumbs" class="pl-4"
        :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" :exact="item.exact">
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </div>
    <AskAnnaDivider v-if="!$vuetify.breakpoint.xsOnly" />
    <AskAnnaCard flat>
      <AskAnnaCardTitle v-if="!sticked" :class="{ 'py-1 pl-3 ': $vuetify.breakpoint.xsOnly }">
        <span class="title font-weight-light">Job: {{ job.name }} </span>
      </AskAnnaCardTitle>
      <AskAnnaDivider v-if="!sticked" :class="{ 'py-1  ': $vuetify.breakpoint.xsOnly }" />

      <AskAnnaToolbar
        v-if="!sticked"
        flat
        dense
        color="white"
        class="run-toolbar"
        :class="{
          'ml-4': $vuetify.breakpoint.mdAndUp,
          'br-r5 ma-3': !$vuetify.breakpoint.xsOnly,
          'ma-0 with-tabs': $vuetify.breakpoint.xsOnly
        }">
        <JobToolBar
          v-if="!sticked"
          :showTitle="false"
          :jobName="job.name"
          :projectName="project.name"
          :isEditJobView="isEditJobView" />

        <AskAnnaSpacer />

        <JobMenuPopup v-if="!isEditJobView && projectJobEdit" :job="job" />
      </AskAnnaToolbar>
    </AskAnnaCard>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  job: {
    type: Object,
    default: function () {
      return {
        name: ''
      }
    }
  },
  project: {
    type: Object,
    default: function () {
      return {
        name: ''
      }
    }
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

const { route } = useRouterAskAnna()
const permission = usePermission()
const breadcrumbs = useBreadcrumbs({ start: 0, end: 5 })

const projectJobEdit = computed(() => permission.getFor(permission.labels.projectJobEdit))

const onStick = data => props.handleOnStick(data.sticked)

const isEditJobView = computed(() => route.name === 'workspace-project-job-edit')
</script>
