<template>
  <v-card flat>
    <v-form ref="newProjectForm">
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <v-text-field
              @input="handleOnInput($event, 'name')"
              :value="projectData.name"
              :rules="[RULE.required('Project name is required')]"
              dense
              autofocus
              outlined
              required
              label="Project name"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ask-anna-description
              cleared
              outlined
              onInputMode
              :description="projectData.description"
              :title="'Project description (optional)'"
              @onChange="handleOnChange"
              @onChangeDescription="handleOnInput($event, 'description')"
            />
          </v-col>
        </v-row>
        <v-row align="center" v-if="false">
          <v-col class="d-flex" cols="12">
            Do you want to create a project from a template? If yes, which project template?
          </v-col>
          <v-col class="d-flex" cols="4">
            <v-select
              v-model="template"
              :items="projectTemplates"
              item-text="name"
              item-value="short_uuid"
              label="Template"
              no-data-text="as"
              dense
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-btn
              text
              small
              outlined
              color="secondary"
              class="mr-2 btn--hover"
              @click="handleCreate"
              :disabled="isStateNotChanged"
            >
              {{ saveButtonText }}
            </v-btn>
            <v-btn small outlined text color="secondary" class="ma-2 btn--hover" @click="handleCancel">
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import { ref, computed, defineComponent } from '@vue/composition-api'
import useValidationRules from '@/core/composition/useValidationRules'

export default defineComponent({
  name: 'Project',

  props: {
    projectData: {
      type: Object,
      default: () => ({
        name: '',
        template: '',
        workspace: '',
        short_uuid: ''
      })
    },
    projectTemplates: {
      type: Array,
      default: () => []
    },
    saveButtonText: {
      type: String,
      default: () => 'Create'
    }
  },

  setup(props, context) {
    const validationRules = useValidationRules()

    const isStateNotChanged = ref(true)

    const template = computed({
      get: () => props.projectData.template,
      set: value => context.emit('handleOnInput', { path: 'template', value })
    })
    const isFormValid = ref(false)
    const newProjectForm = ref(null)

    const handleOnInput = (value, path) => {
      isStateNotChanged.value = false
      context.emit('handleOnInput', { path, value })
    }

    const handleCreate = () => {
      if (!newProjectForm.value.validate()) {
        return
      }
      context.emit('handleCreate')
    }

    const handleCancel = () => context.emit('handleCancel')
    const handleOnChange = () => (isStateNotChanged.value = false)

    const reset = () => newProjectForm.value.reset()
    const resetValidation = () => newProjectForm.value.resetValidation()

    return {
      template,
      isFormValid,
      newProjectForm,
      isStateNotChanged,
      RULE: validationRules.RULES,

      handleCreate,
      handleCancel,
      handleOnInput,
      handleOnChange
    }
  }
})
</script>
