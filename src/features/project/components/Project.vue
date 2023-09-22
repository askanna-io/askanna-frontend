<template>
  <VForm
    @submit.prevent
    ref="newProjectForm"
  >
    <div class="px-4">
      <AskAnnaTitle class="py-2">Project profile</AskAnnaTitle>

      <div class="w-full sm:w-5/12 pb-2">
        <AskAnnaTextField
          autofocus
          :rules="nameRules"
          label="Project name"
          :model-value="projectData.name"
          @update:modelValue="handleOnInput($event, 'name')"
        />
      </div>
      <div class="w-full">
        <AskAnnaDescription
          cleared
          outlined
          :height="480"
          :description="projectData.description"
          :title="'Project description (optional)'"
          @onChange="handleOnChange"
          @onSave="handleSaveDescription"
          @onChangeDescription="handleOnInput($event, 'description')"
        />
      </div>
      <ProjectVisibility
        :visibility="projectData.visibility"
        :workspaceProjectVisibility="workspaceProjectVisibility"
        @onChangeVisibility="handleOnChangeVisibility"
      />
      <AskAnnaCardActions class="pl-0 my-2">
        <AskAnnaButton
          class="mr-1"
          type="submit"
          :disabled="isStateNotChanged"
          @click="handleCreate"
        >
          {{ saveButtonText }}
        </AskAnnaButton>
        <AskAnnaButton @click="handleCancel">
          Cancel
        </AskAnnaButton>
      </AskAnnaCardActions>
    </div>
  </VForm>
</template>

<script setup lang="ts">
const props = defineProps({
  projectData: {
    type: Object,
    default: () => ({
      name: '',
      suuid: '',
      workspace_suuid: '',
      visibility: 'PRIVATE'
    })
  },
  saveButtonText: {
    type: String,
    default: () => 'Create'
  },
  workspaceProjectVisibility: {
    type: String,
    default: () => 'PRIVATE'
  }
})

const emit = defineEmits(['handleOnInput', 'handleCreate', 'handleCancel', 'oSaveDescription'])

const { RULES } = useValidationRules()

const newProjectForm = ref(null)
const isStateNotChanged = ref(!props.projectData.name)
const nameRules = ref([RULES.required('Project name is required')])


const handleOnInput = (value, path) => {
  isStateNotChanged.value = false
  emit('handleOnInput', { path, value })
}

const handleOnChangeVisibility = value => handleOnInput(value, 'visibility')

const handleCreate = async () => {
  const { valid } = await newProjectForm.value?.validate()

  if (!valid) {
    return
  }

  nameRules.value = []
  resetValidation()
  emit('handleCreate')
}

const handleCancel = () => {
  nameRules.value = []
  resetValidation()
  emit('handleCancel')
}

const handleOnChange = () => (isStateNotChanged.value = false)

const resetValidation = () => newProjectForm.value.resetValidation()

const handleSaveDescription = () => emit('oSaveDescription')
</script>
