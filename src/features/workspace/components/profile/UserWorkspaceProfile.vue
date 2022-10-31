<template>
  <AskAnnaContainer fluid class="pt-0">
    <AskAnnaRow dense justify="start">
      <AskAnnaCol xs="12" sm="6" md="4" lg="4" xl="3">
        <AskAnnaTextField
          dense
          outlined
          required
          label="Name"
          :disabled="!editMode"
          :value="workspaceProfile.name"
          @input="handleOnInput($event, 'name')"
        />
      </AskAnnaCol>
    </AskAnnaRow>

    <AskAnnaRow dense justify="start">
      <AskAnnaCol xs="12" sm="6" md="4" lg="4" xl="3">
        <AskAnnaTextField
          dense
          outlined
          required
          label="Title"
          :disabled="!editMode"
          :value="workspaceProfile.job_title"
          @input="handleOnInput($event, 'job_title')"
        />
      </AskAnnaCol>
    </AskAnnaRow>
  </AskAnnaContainer>
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
