<template>
  <div class="flex items-center">
    <div class="w-full sm:w-7/12 md:w-4/12">
      <AskAnnaTextField
        required
        label="Name"
        :disabled="!editMode"
        v-model="state.name"
        @update:modelValue="handleOnInput($event, 'name')"
      />
    </div>
  </div>

  <div class="flex items-center">
    <div class="w-full sm:w-7/12 md:w-4/12">
      <AskAnnaTextField
        required
        label="Title"
        :disabled="!editMode"
        v-model="state.job_title"
        @update:modelValue="handleOnInput($event, 'job_title')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
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

const state = ref({ ...props.workspaceProfile })

watchOnce(() => props.workspaceProfile, () => {
  state.value = { ...props.workspaceProfile }
})

const emit = defineEmits(['onUpdateWorkSpaceProfile'])

const handleOnInput = (value, path) => emit('onUpdateWorkSpaceProfile', { [path]: value })
</script>