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
              autofocus
              label="Project name"
              outlined
              dense
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ask-anna-description
              :description="'asd'"
              :title="'Project description (optional)'"
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
            <v-btn small outlined text color="secondary" class="ma-2 btn--hover" @click="handleCreate">
              Create
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
      default: function () {
        return {
          name: '',
          workspace: '',
          template: ''
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
    const validationRules = useValidationRules()

    const template = computed({
      get: () => props.projectData.template,
      set: value => context.emit('handleOnInput', { path: 'template', value })
    })
    const isFormValid = ref(false)
    const newProjectForm = ref(null)

    const handleOnInput = (value, path) => context.emit('handleOnInput', { path, value })

    const handleCreate = () => {
      if (!newProjectForm.value.validate()) {
        return
      }
      context.emit('handleCreate')
    }

    const handleCancel = () => context.emit('handleCancel')

    const reset = () => newProjectForm.value.reset()
    const resetValidation = () => newProjectForm.value.resetValidation()

    return {
      isFormValid,
      RULE: validationRules.RULES,
      newProjectForm,
      template,
      handleOnInput,
      handleCreate,
      handleCancel
    }
  }
})
</script>
