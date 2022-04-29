<template>
  <v-form ref="newWorkspaceFastForm" @submit.prevent="handlerCreateProject">
    <v-col cols="12" class="pb-0">
      <v-text-field
        v-model="workspaceStore.workspace.name"
        @input="handleOnInput"
        small
        dense
        outlined
        autofocus
        label="Workspace name"
        :rules="nameRules"
        :hide-details="isFormValid"
      />
    </v-col>
    <v-card-actions>
      <v-btn
        text
        small
        outlined
        color="secondary"
        class="mr-1 btn--hover"
        :disabled="!workspaceStore.workspace.name"
        @click="handlerCreateProject"
      >
        Create
      </v-btn>
      <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="handleMoreOptions">
        More options
      </v-btn>
      <v-btn v-if="showCancel" small outlined text class="mr-1" @click="handleCancel">Cancel</v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useValidationRules from '@/core/composition/useValidationRules'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'
import { useWorkspaceStore, WorkspaceVisibility } from '@/features/workspace/useWorkspaceStore'

defineProps({
  showCancel: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['onClose'])

const router = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()

const { RULES } = useValidationRules()

const menu = ref()
const isFormValid = ref(true)
const newWorkspaceFastForm = ref(null)
const nameRules = ref([RULES.required('Workspace name is required')])

const handleMoreOptions = () => {
  emit('onClose')
  router.push({
    name: 'workspace-new'
  })
}

const handlerCreateProject = async () => {
  if (!newWorkspaceFastForm.value.validate()) {
    isFormValid.value = false

    return
  }

  await workspaceStore.createWorkspace({
    name: workspaceStore.workspace.name,
    visibility: WorkspaceVisibility.PRIVATE
  })
  await workspacesStore.getAllWorkspaces()

  resetValidation()
  nameRules.value = []
  menu.value = false
  isFormValid.value = true
  workspaceStore.workspace.name = ''
}

const handleOnInput = val => {
  isFormValid.value = val ? true : false
}

const handleCancel = () => {
  nameRules.value = []
  menu.value = false
  workspaceStore.workspace.name = ''
  isFormValid.value = true
  emit('onClose')
}

const resetValidation = () => newWorkspaceFastForm.value.resetValidation()
</script>
