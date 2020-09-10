<template>
  <v-card class="mx-auto h-100" :elevation="hover ? 16 : 2">
    <v-row>
      <v-col cols="2">
        <v-avatar class="pl-1" size="70" tile>
          <v-img v-if="people.avatar" class="img--rounded" :src="people.avatar" />
          <v-icon v-else size="55">mdi-account-outline</v-icon>
        </v-avatar>
      </v-col>
      <v-col class="ml-3" cols="9" align-self="start">
        <v-list-item color="rgba(0, 0, 0, .4)">
          <v-list-item-content>
            <v-list-item-title class="title">{{ people.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ people.job_title }}</v-list-item-subtitle>
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
          job_title: '',
          created: '',
          modified: '',
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
</style>
