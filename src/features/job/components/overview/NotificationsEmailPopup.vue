<template>
  <v-dialog v-model="dialog" max-width="500px" persistent @click:outside="handleClose" @keydown.esc="handleClose">
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" v-bind="attrs" color="primary" class="pl-1 primary--hover primary--text"> Email</span>
    </template>
    <v-card class="AskAnna-card AskAnna-card--in-dialog">
      <v-toolbar flat dense white--text color="white">
        <v-toolbar-title class="px-0">Notifications</v-toolbar-title>
        <v-spacer />

        <v-btn icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-tabs v-model="currentTab" left align-with-title>
          <v-tabs-slider color="primary" />
          <template v-for="tab of tabs">
            <v-tab v-if="tab.show" ripple :key="tab.id">
              {{ tab.name }}
            </v-tab>
          </template>
        </v-tabs>

        <v-tabs-items v-model="currentTab">
          <template v-for="tab in tabs">
            <v-tab-item :key="tab.name" v-if="tab.show" class="pt-2">
              <div>
                <h4 class="pl-2 pt-2 pb-2">Email:</h4>
                <ol>
                  <li v-for="(item, i) in notifications[tab.name].email" :key="i" height="20">
                    <v-hover v-slot="{ hover }">
                      <div>
                        {{ item }}
                        <ask-anna-copy-text
                          v-if="hover"
                          :text="item"
                          :showText="false"
                          :iconColor="'grey lighten-2'"
                          :buttonType="{ text: true }"
                          :styleClasses="'px-0 white font-weight-regular text--regular body-1'"
                        />
                      </div>
                    </v-hover>
                  </li>
                </ol>
              </div>
            </v-tab-item>
          </template>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'NotificationsEmailPopup',

  props: {
    notifications: {
      type: Object,
      default: () => ({
        all: { email: [] },
        error: { email: [] }
      })
    }
  },

  setup(props) {
    const dialog = ref(false)
    const currentTab = ref('workspace-project-job-running-curl')

    const isAllSet = computed(() => props.notifications['all'].email.some(item => item))
    const isErrorSet = computed(() => props.notifications['error'].email.some(item => item))

    const tabs = computed(() => [
      {
        id: 0,
        name: 'all',
        show: isAllSet.value
      },
      {
        id: 1,
        name: 'error',
        show: isErrorSet.value
      }
    ])

    const handleClose = () => (dialog.value = false)

    return {
      tabs,
      dialog,
      currentTab,

      handleClose
    }
  }
})
</script>
