<template>
  <Component
    :is="TypeComponent"
    v-bind="props"
  />
</template>
<script setup lang="ts">
import JobNavBar from './JobNavBar.vue'
import RunNavBar from './RunNavBar.vue'
import DefaultBar from './DefaultBar.vue'
import CodeBarNotExist from './CodeBarNotExist.vue'
import EmptyNavBarNotExist from './EmptyNavBarNotExist.vue'

const props = defineProps({
  projectVisibility: {
    type: String,
    default: 'PRIVATE'
  },
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
        permission: {},
      }
    }
  }
})

const types = [
  {
    routes: 'workspace-project-code-does-not-exist',
    component: CodeBarNotExist,
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
    component: EmptyNavBarNotExist,
    comporasionFn: item => item.routes === props.routeName
  },
  {
    routes: 'job-suuid',
    component: JobNavBar,
    comporasionFn: () => props.routeName.indexOf('job-suuid') !== -1
  },
  {
    routes: 'workspace-project-jobs-job-run',
    component: RunNavBar,
    comporasionFn: () => props.routeName.indexOf('workspace-project-jobs-job-run') !== -1
  },
  {
    routes: 'workspace-project-job-run-does-not-exist',
    component: EmptyNavBarNotExist,
    comporasionFn: item => item.routes === props.routeName
  }
]

const TypeComponent = computed(() => {
  const type = types.find(item => item.comporasionFn(item))

  return type?.component || DefaultBar
})
</script>
