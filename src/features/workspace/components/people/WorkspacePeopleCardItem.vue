<template>
  <v-card class="mx-auto h-100" :elevation="hover ? 16 : 2">
    <v-row>
      <v-col cols="3">
        <v-avatar color="grey" size="100" tile>
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" />
        </v-avatar>
      </v-col>
      <v-col cols="9" align-self="start">
        <v-list-item color="rgba(0, 0, 0, .4)">
          <v-list-item-content>
            <v-list-item-title class="title">Andrii Shapovalov</v-list-item-title>
            <v-list-item-subtitle>Software Engineer</v-list-item-subtitle>
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
    project: {
      type: Object,
      default: function () {
        return {
          status: 'UNDIFENED',
          runtime: 0,
          memory: 0,
          return_payload: null,
          stdout: null,
          created: '',
          finished: ''
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
