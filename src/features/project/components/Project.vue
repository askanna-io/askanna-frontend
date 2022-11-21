<template>
  <AskAnnaCard flat>
    <VForm ref="newProjectForm" @submit.prevent="handleCreate">
      <AskAnnaContainer fluid class="pt-0">
        <AskAnnaRow>
          <AskAnnaCol cols="12" sm="5" class="pt-0">
            <div class="d-flex transition-swing text-h5 pt-2 pb-4 font-weight-bold">Project profile</div>
            <AskAnnaTextField
              dense
              outlined
              autofocus
              label="Project name"
              :rules="nameRules"
              :value="projectData.name"
              @input="handleOnInput($event, 'name')"
            />
          </AskAnnaCol>
        </AskAnnaRow>
        <AskAnnaRow>
          <AskAnnaCol cols="12">
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
          </AskAnnaCol>
        </AskAnnaRow>
        <AskAnnaRow>
          <AskAnnaCol cols="12">
            <div class="transition-swing text-h5 pt-2 pb-3 font-weight-bold">Project settings</div>

            <VRadioGroup
              hide-details
              :value="projectData.visibility"
              @change="handleOnInput($event, 'visibility')"
              class="pt-0 mt-0"
            >
              <template v-slot:label>
                <div class="text-subtitle-1 pt-0 font-weight-bold black--text">Visibility</div>
              </template>
              <VRadio value="PRIVATE" :ripple="false">
                <template v-slot:label>
                  <div class="primary--black-text">Private</div>
                </template>
              </VRadio>
              <div class="pb-2 pl-8">Only workspace and project members can see this project</div>
              <VRadio value="PUBLIC" :ripple="false" :disabled="workspaceProjectVisibility === 'PRIVATE'">
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
              </VRadio>
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
                  <RouterLink :to="{ name: 'workspace-edit' }" class="ask-anna-link">workspace setting</RouterLink>.
                </div>
                <div v-else class="pl-8 error--text">
                  Your workspace does not allow public sharing of projects. Your workspace setting will overrule the
                  project visibility set to public. If you are a workspace admin, you can change the project visibility
                  in the
                  <RouterLink :to="{ name: 'workspace-edit' }" class="ask-anna-link">workspace setting</RouterLink>.
                </div>
              </template>
            </VRadioGroup>
          </AskAnnaCol>
        </AskAnnaRow>
        <AskAnnaRow>
          <AskAnnaCol cols="12" sm="6" class="pt-0">
            <AskAnnaButton
              text
              small
              outlined
              color="secondary"
              class="mr-2 btn--hover"
              :disabled="isStateNotChanged"
              @click="handleCreate"
            >
              {{ saveButtonText }}
            </AskAnnaButton>
            <AskAnnaButton small outlined text color="secondary" class="ma-2 btn--hover" @click="handleCancel">
              Cancel
            </AskAnnaButton>
          </AskAnnaCol>
        </AskAnnaRow>
      </AskAnnaContainer>
    </VForm>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const props = defineProps({
  projectData: {
    type: Object,
    default: () => ({
      name: '',
      workspace: '',
      suuid: '',
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

const isStateNotChanged = ref(!props.projectData.name)
const nameRules = ref([RULES.required('Project name is required')])

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

const handleSaveDescription = () => emit('oSaveDescription')
</script>
