<template>
  <component :is="TypeComponent" v-bind="props" />
</template>
<script setup lang="ts">
import JobNavBar from './JobNavBar.vue'
import RunNavBar from './RunNavBar.vue'
import DefaultBar from './DefaultBar.vue'
import JobNavBarNotExist from './JobNavBarNotExist.vue'
import PackageBarNotExist from './PackageBarNotExist.vue'
import RunNavBarNotExist from './RunNavBarNotExist.vue'

const props = defineProps({
  routeName: {
    type: [Number, String],
    default: 'workspace-project-code'
  },
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
        name: '',
        description: '',
        permission: {}
      }
    }
  },
  sticked: {
    type: Boolean,
    default: () => false
  },
  isShowProjectBar: {
    type: Boolean,
    default: false
  },
  handleOnStick: {
    type: Function,
    default: () => {}
  },
  handleShowProjectBar: {
    type: Function,
    default: () => {}
  },
  projectBreadcrumbs: {
    type: Array,
    default: () => []
  }
})

const types = [
  {
    routes: 'workspace-project-code-does-not-exist',
    component: PackageBarNotExist,
    comporasionFn: item => item.routes === props.routeName
  },
  {
    routes: [
      'workspace-project-job-edit',
      'workspace-project-job-overiew',
      'workspace-project-job-runs',
      'workspace-project-jobs-job-runs-table',
      'workspace-project-jobs-job-runs-compare'
    ],
    component: JobNavBar,
    comporasionFn: item => item.routes.some(route => route === props.routeName)
  },
  {
    routes: 'workspace-project-job-does-not-exist',
    component: JobNavBarNotExist,
    comporasionFn: item => item.routes === props.routeName
  },
  {
    routes: 'job-uuid',
    component: JobNavBar,
    comporasionFn: () => props.routeName.indexOf('job-uuid') !== -1
  },
  {
    routes: 'workspace-project-jobs-job-run',
    component: RunNavBar,
    comporasionFn: () => props.routeName.indexOf('workspace-project-jobs-job-run') !== -1
  },
  {
    routes: 'workspace-project-job-run-does-not-exist',
    component: RunNavBarNotExist,
    comporasionFn: item => item.routes === props.routeName
  }
]

const TypeComponent = computed(() => {
  const type = types.find(item => item.comporasionFn(item))

  return type?.component || DefaultBar
})
</script>
