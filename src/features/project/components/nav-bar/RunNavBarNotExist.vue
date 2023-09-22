<template></template>
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

const jobStore = useJobStore()

const jobName = computed(() => jobStore.job.name)
const breadcrumbs = useBreadcrumbs({ start: 0, end: 6 })

const onStick = data => props.handleOnStick(data.sticked)
</script>
