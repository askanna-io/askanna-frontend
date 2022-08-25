<template>
  <v-dialog
    v-model="variablesStore.variablePopup"
    max-width="500px"
    persistent
    @click:outside="handleClose"
    @keydown.esc="handleClose"
  >
    <v-card min-width="310px" max-width="500px">
      <v-app-bar dense color="white" flat>
        <span class="title font-weight-light">{{ formTitle }}</span>
        <v-spacer />

        <v-btn icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text class="pa-0">
        <v-form ref="variableFormRef" v-model="isFormValid" @submit="handleSave">
          <v-container class="pb-0 pt-0">
            <v-row>
              <v-col cols="12" sm="12" md="12" class="pb-0">
                <v-text-field
                  id="edited-item-name"
                  dense
                  small
                  outlined
                  autofocus
                  label="Name"
                  validate-on-blur
                  :value="variable.name"
                  :error-messages="errorData.error.name"
                  :rules="[
                    RULE.required('The name is required'),
                    RULE.max('The maximum length of the variable name is 128 characters', 128)
                  ]"
                  @input="handleSetName({ path: 'name', value: $event })"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12" class="pb-0">
                <v-textarea
                  outlined
                  no-resize
                  label="Value"
                  name="input-7-4"
                  validate-on-blur
                  :value="variable.value"
                  :error-messages="errorData.error.value"
                  :rules="[
                    RULE.required('The value is required'),
                    RULE.max('The maximum length of the variable value is 10,000 characters', 10000)
                  ]"
                  @input="handleSetVariable({ path: 'value', value: $event })"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-0" cols="2">
                <v-checkbox
                  v-model="maskedModel"
                  hide-details
                  label="Masked"
                  class="mt-0 pt-0"
                  :disabled="isEdit && variable.is_masked && state.isSaved"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="pl-3 pr-2">
        <v-btn @click="handleClose" small outlined text color="secondary" class="mr-1 btn--hover"> Cancel </v-btn>
        <v-btn v-if="isEdit" small outlined text color="error" class="mr-1 btn--hover" @click="deleteItem">
          Delete
        </v-btn>
        <v-btn text small outlined color="secondary" class="mr-1 btn--hover" @click="handleSave"> Save </v-btn>
      </v-card-actions>
    </v-card>
    <variable-confirm-delete-popup
      :value="state.dialogDelete"
      :variableName="variable.name"
      @onDelete="handleConfirmDeleteItem"
      @onCloseDeletePopup="handleCloseDelete"
    />
  </v-dialog>
</template>
<script setup lang="ts">
import useValidationRules from '@/core/composition/useValidationRules'
import { useVariablesStore } from '@/features/variables/useVariablesStore'
import { ref, reactive, computed, onBeforeUnmount } from '@vue/composition-api'
import VariableConfirmDeletePopup from '@/features/variables/components/VariableConfirmDeletePopup.vue'

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

const state = reactive({
  dialog: false,
  isSaved: true,
  dialogDelete: false,
  isValueChanged: false
})

const isEdit = computed(() => Boolean(variable.value.short_uuid))
const formTitle = computed(() => (variable.value.short_uuid ? 'Edit a variable' : 'Add a variable'))
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
  const { name, short_uuid } = variable.value

  await deleteVariable({
    name,
    variableId: short_uuid,
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
    project: props.projectId
  })
}

const handleUpdateVariable = async () => {
  const { name, value, is_masked, short_uuid: variableId } = variable.value
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
