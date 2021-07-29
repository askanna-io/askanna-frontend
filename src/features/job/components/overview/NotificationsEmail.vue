<template>
  <div class="notification">
    <v-tooltip top left nudge-right="40" content-class="opacity-1">
      <template v-slot:activator="{ on }">
        <div v-on="on">
          <div class="code-wrapper">
            {{ title }}:
            <template v-if="isSetNotifications">
              <notifications-email-popup :notifications="notifications" />
            </template>
            <template v-else>
              <span class="pl-1 primary--hover">
                No
              </span>
            </template>
          </div>
        </div>
      </template>
      <template v-if="isSetNotifications">
        Click to see details
      </template>
      <template v-else>
        For this job, notifications are not configured
      </template>
    </v-tooltip>
  </div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
import NotificationsEmailPopup from './NotificationsEmailPopup'

export default defineComponent({
  name: 'NotificationsEmail',

  props: {
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
  },

  components: { NotificationsEmailPopup },

  setup(props) {
    const isSetNotifications = computed(() =>
      Object.entries(props.notifications).some(([key, item]) => item.email.length)
    )

    return { isSetNotifications }
  }
})
</script>
<style scoped>
.notification {
  max-width: 150px;
}
.code-wrapper {
  display: flex;
}
</style>
