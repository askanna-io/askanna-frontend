<template>
  <v-container fluid>
    <v-row dense justify="start">
      <v-col cols="4">
        <v-text-field
          dense
          outlined
          required
          label="Name"
          :value="workspaceProfile.name"
          @input="handleOnInput($event, 'name')"
        />
      </v-col>
    </v-row>

    <v-row dense justify="start">
      <v-col cols="4">
        <v-text-field
          dense
          outlined
          required
          label="Title"
          :value="workspaceProfile.job_title"
          @input="handleOnInput($event, 'job_title')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'UserWorkspaceProfile',

  props: {
    workspaceProfile: {
      type: Object,
      default: function () {
        return {
          name: '',
          job_title: ''
        }
      }
    },
    projectTemplates: {
      type: Array,
      default: function () {
        return []
      }
    }
  },

  setup(props, context) {
    const handleOnInput = (value, path) => context.emit('onUpdateWorkSpaceProfile', { [path]: value })

    return {
      handleOnInput
    }
  }
})
</script>
