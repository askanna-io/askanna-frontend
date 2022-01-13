<template>
  <v-card flat>
    <v-form ref="newProjectForm" @submit.prevent="handleCreate">
      <v-container fluid class="pt-0">
        <v-row>
          <v-col cols="12" sm="5" class="pt-0">
            <div class="d-flex transition-swing text-h5 pt-2 pb-4 font-weight-bold">Project profile</div>
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
            <AskAnnaDescription
              cleared
              outlined
              :height="480"
              :description="projectData.description"
              :title="'Project description (optional)'"
              @onChange="handleOnChange"
              @onChangeDescription="handleOnInput($event, 'description')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="transition-swing text-h5 pt-2 pb-3 font-weight-bold">Project settings</div>

            <v-radio-group
              hide-details
              :value="projectData.visibility"
              @change="handleOnInput($event, 'visibility')"
              class="pt-0 mt-0"
            >
              <template v-slot:label>
                <div class="text-subtitle-1 pt-0 font-weight-bold black--text">Visibility</div>
              </template>
              <v-radio value="PRIVATE" :ripple="false">
                <template v-slot:label>
                  <div class="primary--black-text">Private</div>
                </template>
              </v-radio>
              <div class="pb-2 pl-8">Only workspace and project members can see this project</div>
              <v-radio value="PUBLIC" :ripple="false" :disabled="workspaceProjectVisibility === 'PRIVATE'">
                <template v-slot:label>
                  <div
                    class="primary--black-text"
                    :class="{
                      'grey--text': projectData.visibility === 'PRIVATE' && workspaceProjectVisibility === 'PRIVATE',
                      'error--text': projectData.visibility === 'PUBLIC' && workspaceProjectVisibility === 'PRIVATE'
                    }"
                  >
                    Public
                  </div>
                </template>
              </v-radio>
              <div v-if="workspaceProjectVisibility === 'PUBLIC'" class="pl-8">
                Anyone on the internet can view this project
              </div>
              <template v-else>
                <div
                  v-if="projectData.visibility === 'PRIVATE' && workspaceProjectVisibility === 'PRIVATE'"
                  class="pl-8 grey--text"
                >
                  You cannot select this option, because your workspace does not allow public sharing of projects. If
                  you are a workspace admin, you can change the project visibility in the
                  <router-link :to="{ name: 'workspace-edit' }" class="ask-anna-link">workspace setting</router-link>.
                </div>
                <div v-else class="pl-8 error--text">
                  Your workspace does not allow public sharing of projects. Your workspace setting will overrule the
                  project visibility set to public. If you are a workspace admin, you can change the project visibility
                  in the
                  <router-link :to="{ name: 'workspace-edit' }" class="ask-anna-link">workspace setting</router-link>.
                </div>
              </template>
            </v-radio-group>
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
          <v-col cols="12" sm="6" class="pt-0">
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
            <v-btn small outlined text color="secondary" class="ma-2 btn--hover" @click="handleCancel"> Cancel </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import useValidationRules from '@/core/composition/useValidationRules'
import AskAnnaDescription from '@/core/components/shared/AskAnnaDescription.vue'

const props = defineProps({
  projectData: {
    type: Object,
    default: () => ({
      name: '',
      template: '',
      workspace: '',
      short_uuid: '',
      visibility: 'PRIVATE'
    })
  },
  projectTemplates: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['handleOnInput', 'handleCreate', 'handleCancel'])

const { RULES } = useValidationRules()

const isStateNotChanged = ref(!props.projectData.name)
const nameRules = ref([RULES.required('Project name is required')])

const template = computed({
  get: () => props.projectData.template,
  set: value => emit('handleOnInput', { path: 'template', value })
})
const newProjectForm = ref(null)

const handleOnInput = (value, path) => {
  isStateNotChanged.value = false
  emit('handleOnInput', { path, value })
}

const handleCreate = () => {
  if (!newProjectForm.value.validate()) {
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
</script>
