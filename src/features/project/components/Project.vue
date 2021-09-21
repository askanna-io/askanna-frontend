<template>
  <v-card flat>
    <v-form ref="newProjectForm" @submit.prevent="handleCreate">
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <v-text-field
              dense
              outlined
              autofocus
              label="Project name"
              :rules="nameRules"
              :value="projectData.name"
              @input="handleOnInput($event, 'name')"
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
              dense
              item-text="name"
              label="Template"
              no-data-text="as"
              item-value="short_uuid"
              :items="projectTemplates"
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
              :disabled="isStateNotChanged"
              @click="handleCreate"
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
    const { RULES } = useValidationRules()

    const isStateNotChanged = ref(!props.projectData.name)
    const nameRules = ref([RULES.required('Project name is required')])

    const template = computed({
      get: () => props.projectData.template,
      set: value => context.emit('handleOnInput', { path: 'template', value })
    })
    const newProjectForm = ref(null)

    const handleOnInput = (value, path) => {
      isStateNotChanged.value = false
      context.emit('handleOnInput', { path, value })
    }

    const handleCreate = () => {
      if (!newProjectForm.value.validate()) {
        return
      }
      nameRules.value = []
      resetValidation()
      context.emit('handleCreate')
    }

    const handleCancel = () => {
      nameRules.value = []
      resetValidation()
      context.emit('handleCancel')
    }

    const handleOnChange = () => (isStateNotChanged.value = false)
    const resetValidation = () => newProjectForm.value.resetValidation()

    return {
      template,
      nameRules,
      newProjectForm,
      isStateNotChanged,

      handleCreate,
      handleCancel,
      handleOnInput,
      handleOnChange
    }
  }
})
</script>
