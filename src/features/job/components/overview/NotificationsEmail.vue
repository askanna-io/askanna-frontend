<template>
  <div class="notification">
    <AskAnnaTooltip top left nudge-right="40" content-class="opacity-1">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <div class="code-wrapper">
            <span class="font-weight-bold">{{ title }}:</span>
            <template v-if="isSetNotifications">
              <NotificationsEmailPopup :notifications="notifications" />
            </template>
            <template v-else>
              <span class="pl-1 primary--hover"> No </span>
            </template>
          </div>
        </div>
      </template>
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

const isSetNotifications = computed(() => Object.entries(props.notifications).some(([_, item]) => item.email.length))
</script>
<style scoped>
.notification {
  max-width: 150px;
}
.code-wrapper {
  display: flex;
}
</style>
