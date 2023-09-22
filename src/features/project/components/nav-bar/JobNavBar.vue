<template>
  <div>
    <AskAnnaCardTitle>
      Job: {{ job.name }}<span v-if="isEditJobView"> - Edit mode</span>
    </AskAnnaCardTitle>
    <AskAnnaDivider v-if="!$vuetify.display.xs && !isEditJobView" />

    <AskAnnaToolbar
      v-if="!isEditJobView"
      flat
      color="white"
      density="compact"
      class="my-3"
      :class="{
        'px-0': !isMobilePlatform && (+$vuetify.display.width < 850),
        'px-4': isMobilePlatform || (+$vuetify.display.width > 850)
      }"
    >
      <div class="flex w-full items-center justify-between">
        <JobToolBar
          :jobName="job.name"
          :projectName="project.name"
          :isEditJobView="isEditJobView"
        />

        <JobPopupMenu
          v-if="projectJobEdit"
          :job="job"
        />
      </div>
    </AskAnnaToolbar>
  </div>
</template>
<script setup lang="ts">
defineProps({
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
  handleOnStick: {
    type: Function,
    default: () => { }
  }
})

const { route } = useRouterAskAnna()
const permission = useAskAnnaPermission()

const projectJobEdit = computed(() => permission.getFor(permission.labels.projectJobEdit))
const isEditJobView = computed(() => route.name === 'workspace-project-job-edit')

const isMobilePlatform = computed(() => {
  const platform = window.navigator.userAgent.toLowerCase()
  return (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform))
})
</script>
