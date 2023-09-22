<template>
  <div>
    <AskAnnaCardTitle>
      <div class="flex w-full items-center justify-between">
        <span class="text-h6 group font-weight-light">Run:
          <span v-if="isEditRunView">{{ runName }} - Edit mode</span>
          <AskAnnaCopyText
            v-if="!isEditRunView"
            :text="runName"
            :buttonType="{ text: true }"
            :styleClasses="'px-0 white title font-weight-light'"
          />
        </span>
        <RunInfoStatus
          text=""
          :value="runIdStatus"
          class="text-h6 font-weight-light"
        />
      </div>

    </AskAnnaCardTitle>

    <AskAnnaDivider v-if="!isEditRunView" />
    <AskAnnaToolbar
      v-if="!isEditRunView"
      flat
      class="my-3"
      color="white"
      density="compact"
      :class="{
        'px-0': !isMobilePlatform && (+$vuetify.display.width < 850),
        'pl-4': isMobilePlatform || (+$vuetify.display.width > 850)
      }"
    >
      <div class="flex w-full items-center justify-between">
        <RunToolBar
          :jobrun="run"
          :isEditRunView="isEditRunView"
          :projectRunEdit="projectRunEdit"
        />
        <RunPopupMenu v-if="!isEditRunView && projectRunEdit" />
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
})

const runStore = useRunStore()
const { route } = useRouterAskAnna()
const permission = useAskAnnaPermission()

const run = computed(() => runStore.run)
const runIdStatus = computed(() => runStore.run.status)
const runName = computed(() => (run.value.name ? ` ${run.value.name}` : ` ${run.value.suuid}`))
const projectRunEdit = computed(() => permission.getFor(permission.labels.projectRunEdit))
const isEditRunView = computed(() => route.name === 'workspace-project-jobs-job-run-edit')

const isMobilePlatform = computed(() => {
  const platform = window.navigator.userAgent.toLowerCase()
  return (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform))
})
</script>
