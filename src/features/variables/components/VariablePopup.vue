<template>
  <AskAnnaDialog
    v-model="variablesStore.variablePopup"
    persistent
    max-width="500px"
    @onClose="handleClose"
  >
    <template v-slot:title>
      <p
        v-if="isEdit"
        class="whitespace-pre-wrap sm:truncate"
      >
        Edit <span class="text-primary">{{ variableName }}</span>
      </p>
      <p
        v-else
        class="whitespace-pre-wrap sm:truncate"
      >
        Add a variable
      </p>
    </template>

    <template v-slot:body>
      <VForm
        ref="variableFormRef"
        v-model="isFormValid"
        @submit="handleSave"
      >
        <div class="pb-3">
          <AskAnnaTextField
            autofocus
            label="Name"
            validate-on="blur"
            :model-value="variable.name"
            :error-messages="errorData.error.name"
            :rules="[
              RULE.required('The name is required'),
              RULE.max('The maximum length of the variable name is 128 characters', 128)
            ]"
            @update:modelValue="handleSetName({ path: 'name', value: $event })"
          />
        </div>
        <div>
          <AskAnnaTextArea
            no-resize
            label="Value"
            validate-on="blur"
            :model-value="variable.value"
            :error-messages="errorData.error.value"
            :rules="[
              RULE.required('The value is required'),
              RULE.max('The maximum length of the variable value is 10,000 characters', 10000)
            ]"
            @update:modelValue="handleSetVariable({ path: 'value', value: $event })"
          />
        </div>
        <div>
          <AskAnnaCheckbox
            v-model="maskedModel"
            hide-details
            label="Masked"
            class="mt-0 pt-0"
            :disabled="isEdit && variable.is_masked && state.isSaved"
          />
        </div>
      </VForm>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="handleSave"> {{ isEdit ? 'Save my changes' : 'Create variable' }} </AskAnnaButton>
      <AskAnnaButton
        v-if="isEdit"
        color="error"
        @click="deleteItem"
      > Delete variable </AskAnnaButton>
      <AskAnnaButton @click="handleClose">Cancel </AskAnnaButton>
    </template>
  </AskAnnaDialog>
  <VariablePopupConfirmDelete
    :value="state.dialogDelete"
    :variableName="variableName"
    @onClose="handleCloseDelete"
    @onDelete="handleConfirmDeleteItem"
  />
</template>
<script setup lang="ts">
const props = defineProps({
  projectId: {
    type: String,
    default: () => ''
  }
})

const variablesStore = useVariablesStore()
const validationRules = useValidationRules()

const isFormValid = ref(false)
const variableFormRef = ref(null)
const errorData = reactive({
  error: { name: '', value: '' }
})

const reset = () => variableFormRef.value.reset()
const resetValidation = () => variableFormRef.value.resetValidation()

const { setVariable, resetVariable, createVariable, updateVariable, deleteVariable } = variablesStore

const variable = computed(() => variablesStore.variable)
const variableName = computed(() => variablesStore.variableName)

const state = reactive({
  dialog: false,
  isSaved: true,
  dialogDelete: false,
  isValueChanged: false
})

const isEdit = computed(() => Boolean(variable.value.suuid))
const maskedModel = computed({
  get: () => variable.value.is_masked,
  set: value => {
    if (!variable.value.is_masked) {
      state.isSaved = false
    }
    setVariable({ path: 'is_masked', value })
  }
})

const deleteItem = () => {
  state.dialogDelete = true
}

const handleConfirmDeleteItem = async () => {
  const { name, suuid } = variable.value

  await deleteVariable({
    name,
    variableId: suuid,
    projectId: props.projectId
  })
  handleCloseDelete()
}

const handleClose = async () => {
  reset()
  resetError()
  resetVariable()
  resetValidation()

  state.isSaved = true
  state.isValueChanged = false
  variablesStore.variablePopup = false
}

const handleCloseDelete = () => {
  state.dialogDelete = false
  handleClose()
}

const handleSave = async () => {
  if (!variableFormRef.value.validate()) {
    return
  }
  const variable = isEdit.value ? await handleUpdateVariable() : await handleCreateVariable()

  if (variable && variable.response && variable.response.status === 400) {
    errorData.error = { ...errorData.error, ...variable.response.data }
    return
  }

  handleClose()
}

const handleCreateVariable = async () => {
  const { name, value, is_masked } = variable.value
  return await createVariable({
    name,
    value,
    is_masked,
    project_suuid: props.projectId
  })
}

const handleUpdateVariable = async () => {
  const { name, value, is_masked, suuid: variableId } = variable.value
  let data = { name, is_masked }
  if (state.isValueChanged) {
    data.value = value
  }

  return await updateVariable({
    ...data,
    is_masked,
    variableId,
    projectId: props.projectId
  })
}

const handleSetName = data => {
  errorData.error.name = ''
  setVariable(data)
}

const handleSetVariable = data => {
  errorData.error.value = ''
  state.isValueChanged = true
  setVariable(data)
}

const resetError = () => {
  errorData.error = { name: '', value: '' }
}

onBeforeUnmount(() => resetVariable())

const RULE = validationRules.RULES
</script>
