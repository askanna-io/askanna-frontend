<template>
  <v-card class="mx-auto h-100 cursor--pointer" :elevation="hover ? 16 : 2">
    <v-app-bar height="10" absolute flat dense white--text color="white">
      <v-spacer />
      <v-icon v-if="statusColor" class="mt-5" :color="statusColor">mdi-email-send-outline</v-icon>
    </v-app-bar>
    <v-row>
      <v-col cols="2" class="ml-2">
        <v-avatar class="ml-1" size="60" tile>
          <v-img class="img--rounded" :src="people.avatar.small" />
        </v-avatar>
      </v-col>
      <v-col class="ml-3" cols="9" align-self="start">
        <v-list-item color="rgba(0, 0, 0, .4)">
          <v-list-item-content>
            <v-list-item-title class="people-title">{{ people.name || people.email }}</v-list-item-title>
            <v-list-item-subtitle>{{ people.role.name }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspacePeopleCardItem',

  props: {
    people: {
      type: Object,
      default: function () {
        return {
          uuid: '',
          name: '',
          role: '',
          created: '',
          modified: '',
          job_title: '',
          short_uuid: '',
          last_active: ''
        }
      }
    },
    description: {
      type: String,
      default: () => ''
    },
    workspaceName: {
      type: String,
      default: () => ''
    },
    hover: {
      type: Boolean,
      default: false
    },
    statusColor: {
      type: [String, Boolean],
      default: 'white'
    }
  }
})
</script>
<style scoped>
.h-100 {
  height: 100%;
}
.project--description {
  min-height: 82px;
  max-height: 86px;
  overflow: hidden;
}
.people-title {
  font-weight: 300px;
}
</style>
