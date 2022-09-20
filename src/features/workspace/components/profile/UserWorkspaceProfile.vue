<template>
  <v-container fluid class="pt-0">
    <v-row dense justify="start">
      <v-col xs="12" sm="6" md="4" lg="4" xl="3">
        <v-text-field
          dense
          outlined
          required
          label="Name"
          :disabled="!editMode"
          :value="workspaceProfile.name"
          @input="handleOnInput($event, 'name')"
        />
      </v-col>
    </v-row>

    <v-row dense justify="start">
      <v-col xs="12" sm="6" md="4" lg="4" xl="3">
        <v-text-field
          dense
          outlined
          required
          label="Title"
          :disabled="!editMode"
          :value="workspaceProfile.job_title"
          @input="handleOnInput($event, 'job_title')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
defineProps({
  editMode: {
    type: Boolean,
    default: true
  },
  workspaceProfile: {
    type: Object,
    default: function () {
      return {
        name: '',
        job_title: ''
      }
    }
  }
})

const emit = defineEmits(['onUpdateWorkSpaceProfile'])

const handleOnInput = (value, path) => emit('onUpdateWorkSpaceProfile', { [path]: value })
</script>
