<template>
  <div :class="{ 'mb-3': sticked }">
    <div v-sticky="true" on-stick="onStick" :sticky-margin-width="0" sticky-offset="{top: 52, bottom: 10}">
      <AskAnnaToolbar v-if="sticked" dense color="white" class="br-r5 ma-3" :flat="!sticked">
        <VBreadcrumbs :items="breadcrumbs" class="pl-0">
          <template v-slot:item="{ item }">
            <VBreadcrumbsItem :to="item.to" :exact="item.exact">
              {{ item.title }}
            </VBreadcrumbsItem>
          </template>
        </VBreadcrumbs>
        <AskAnnaSpacer />
      </AskAnnaToolbar>
      <AskAnnaSlideYTransition>
        <AskAnnaCard v-if="sticked" :flat="!sticked" :class="{ 'ma-3': sticked }">
          <AskAnnaDivider v-if="!sticked" />
          <ProjectToolBar :projectName="project.name" />
          <AskAnnaDivider />
          <JobToolBar :jobName="jobName" :projectName="project.name" />
        </AskAnnaCard>
      </AskAnnaSlideYTransition>
    </div>
    <div class="askAnna-breadcrumbs" :class="{ 'mb-2': $vuetify.breakpoint.xsOnly }">
      <VBreadcrumbs v-if="!sticked" :items="breadcrumbs" :class="{ 'py-0 mt-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" :exact="item.exact">
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </div>
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

const jobName = computed(() => jobStore.job.name)
const breadcrumbs = useBreadcrumbs({ start: 0, end: 6 })

const onStick = data => props.handleOnStick(data.sticked)
</script>
