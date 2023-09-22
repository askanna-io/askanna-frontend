<template>
  <div class="flex h-8 items-center">
    <div>
      <div class="flex">
        <span class="font-bold">{{ title }}:</span>
        <template v-if="isSetNotifications">
          <NotificationsEmailPopup :notifications="notifications" />
        </template>
        <template v-else>
          <span class="pl-1 hover:text-primary"> No </span>
        </template>
      </div>
    </div>
    <AskAnnaTooltip>
      <template v-if="isSetNotifications">Click to see details </template>
      <template v-else> For this job, notifications are not configured </template>
    </AskAnnaTooltip>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },

  notifications: {
    type: Object,
    default: () => ({
      all: { email: [] },
      error: { email: [] }
    })
  }
})

const isSetNotifications = computed(() => Object.entries(props.notifications || {}).some(([_, item]) => item.email.length))
</script>
