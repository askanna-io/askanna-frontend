<template>
  <v-dialog
    v-model="variablePopupVmodel"
    max-width="500px"
    persistent
    @click:outside="handleClose"
    @keydown.esc="handleClose"
  >
    <v-card>
      <v-app-bar dense color="white" flat>
        <v-card-title>
          <span class="title font-weight-light">{{ formTitle }}</span>
        </v-card-title>
        <v-spacer />

        <v-btn icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-card-text>
        <v-form ref="variableFormRef" v-model="isFormValid" @submit="handleSave">
          <v-container class="pb-0">
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
                  :error-messages="error.name"
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
                  :error-messages="error.value"
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
                  :disabled="isEdit && variable.is_masked && isSaved"
                  hide-details
                  label="Masked"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="ml-5">
        <v-btn @click="handleClose" small outlined text color="secondary" class="mr-1 btn--hover">
          Cancel
        </v-btn>
        <v-btn v-if="isEdit" small outlined text color="error" class="mr-1 btn--hover" @click="deleteItem">
          Delete
        </v-btn>
        <v-btn text small outlined color="secondary" class="mr-1 btn--hover" @click="handleSave">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <variable-confirm-delete-popup
      :value="dialogDelete"
      :variableName="variable.name"
      @onDelete="handleConfirmDeleteItem"
      @onCloseDeletePopup="handleCloseDelete"
    />
  </v-dialog>
</template>
<script>
import useValidationRules from '@/core/composition/useValidationRules'
import useVariablesStore from '@/features/variables/composition/useVariablesStore'
import VariableConfirmDeletePopup from '@/features/variables/components/VariableConfirmDeletePopup'
import { ref, toRefs, reactive, computed, onBeforeUnmount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'VariablePopup',

  props: {
    projectId: {
      type: String,
      default: () => ''
    }
  },

  components: { VariableConfirmDeletePopup },

  setup(props, context) {
    const variablesStore = useVariablesStore()
    const validationRules = useValidationRules()

    const isFormValid = ref(false)
    const variableFormRef = ref(null)
    const errorData = reactive({
      error: { name: '', value: '' }
    })

    const reset = () => variableFormRef.value.reset()
    const resetValidation = () => variableFormRef.value.resetValidation()

    const {
      setVariable,
      resetVariable,
      createVariable,
      updateVariable,
      deleteVariable,
      variablePopupVmodel
    } = variablesStore

    const variable = computed(() => variablesStore.variable.value)

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
      variablePopupVmodel.value = false
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

    return {
      ...toRefs(state),
      ...toRefs(errorData),
      isEdit,
      variable,
      formTitle,
      deleteItem,
      handleSave,
      setVariable,
      isFormValid,
      handleClose,
      maskedModel,
      handleSetName,
      variableFormRef,
      handleSetVariable,
      handleCloseDelete,
      variablePopupVmodel,
      handleConfirmDeleteItem,
      RULE: validationRules.RULES
    }
  }
})
</script>
