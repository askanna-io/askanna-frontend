<template>
  <div :class="{ 'mb-3': sticked }">
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <AskAnnaToolbar v-if="sticked" dense color="white" class="br-r5 ma-3 askAnna-breadcrumbs" :flat="!sticked">
        <div class="">
          <VBreadcrumbs :items="breadcrumbs" class="pl-0" :class="{ 'ma-0 pa-0': $vuetify.breakpoint.xsOnly }">
            <template v-slot:item="{ item }">
              <VBreadcrumbsItem :to="item.to" :exact="item.exact">
                {{ item.title }}
              </VBreadcrumbsItem>
            </template>
          </VBreadcrumbs>
        </div>
        <AskAnnaSpacer />
      </AskAnnaToolbar>
      <AskAnnaSlideYTransition>
        <AskAnnaCard v-if="sticked" :flat="!sticked" :class="{ 'ma-3': sticked }">
          <AskAnnaDivider v-if="!sticked" />
          <ProjectToolBar :projectName="project.name" />
          <AskAnnaDivider />
          <JobToolBar :jobName="jobName" :projectName="project.name" />
          <AskAnnaDivider v-if="sticked" />
          <RunToolBar v-if="sticked" :runId="runId" />
        </AskAnnaCard>
      </AskAnnaSlideYTransition>
    </div>
    <div class="askAnna-breadcrumbs" :class="{ 'mb-2 mt-0': $vuetify.breakpoint.xsOnly }">
      <VBreadcrumbs v-if="!sticked" :items="breadcrumbs" :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }">
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
        <span class="title font-weight-light"
          >Run{{ runName }}
          <AskAnnaCopyText
            v-if="!run.name"
            :text="run.suuid"
            :buttonType="{ text: true }"
            :styleClasses="'px-0 white title font-weight-light primary--black '"
          />
        </span>
        <AskAnnaSpacer />
        <RunInfoStatus class="title font-weight-light" text="" :value="runIdStatus" />
      </AskAnnaCardTitle>

      <AskAnnaDivider v-if="!sticked && !$vuetify.breakpoint.xsOnly" />

      <AskAnnaToolbar
        v-if="!sticked"
        flat
        dense
        color="white"
        :class="{ 'br-r5 ma-3': !$vuetify.breakpoint.xsOnly, 'ma-0 with-tabs': $vuetify.breakpoint.xsOnly }"
      >
        <RunToolBar :showTitle="false" :jobrun="run" :projectRunEdit="projectRunEdit" :isEditRunView="isEditRunView" />

        <AskAnnaSpacer />

        <RunMenuPopup v-if="!isEditRunView && projectRunEdit && !$vuetify.breakpoint.xsOnly" />
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
    default: () => {}
  }
})

const jobStore = useJobStore()
const runStore = useRunStore()
const permission = usePermission()
const { route } = useRouterAskAnna()
const breadcrumbs = useBreadcrumbs({ start: 0, end: 6 })

const projectRunEdit = computed(() => permission.getFor(permission.labels.projectRunEdit))

const { runId } = route.params
const run = computed(() => runStore.run)
const jobName = computed(() => jobStore.job.name)
const runIdStatus = computed(() => runStore.run.status)
const runName = computed(() => (run.value.name ? `: ${run.value.name}` : ':'))

const isEditRunView = computed(() => route.name === 'workspace-project-jobs-job-run-edit')

const onStick = data => props.handleOnStick(data.sticked)
</script>
