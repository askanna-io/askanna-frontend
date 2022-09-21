<template>
  <v-form ref="newWorkspaceFastForm" @submit.prevent="handlerCreateProject">
    <v-col cols="12" class="pb-0">
      <v-text-field
        v-model="workspaceStore.newWorkspace.name"
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
        :disabled="!workspaceStore.newWorkspace.name"
        @click="handlerCreate"
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
defineProps({
  showCancel: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits(['onClose'])

const snackBar = useSnackBar()
const { router } = useRouterAskAnna()
const { RULES } = useValidationRules()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()

const formRef = ref(null)
const isFormValid = ref(true)
const newWorkspaceFastForm = ref(null)
const nameRules = ref([RULES.required('Workspace name is required')])

const handleMoreOptions = () => {
  emit('onClose')
  router.push({
    name: 'workspace-new'
  })
}

const handlerCreate = async () => {
  if (!formRef.value.validate()) {
    isFormValid.value = false

    return
  }

  await workspaceStore.createWorkspace({
    name: workspaceStore.newWorkspace.name,
    visibility: WorkspaceVisibility.PRIVATE
  })
  await workspacesStore.getAllWorkspaces()

  snackBar.showSnackBar({
    timeout: 2500,
    color: 'success',
    message: `The workspace ${workspaceStore.newWorkspace.name} was created`
  })

  resetValidation()
  nameRules.value = []
  isFormValid.value = true
  workspaceStore.newWorkspace = { ...defaultWorkspace }
}

const handleOnInput = val => {
  isFormValid.value = val ? true : false
}

const handleCancel = () => {
  nameRules.value = []
  workspaceStore.newWorkspace = { ...defaultWorkspace }
  isFormValid.value = true
  emit('onClose')
}

const resetValidation = () => formRef.value.resetValidation()

defineExpose({
  newWorkspaceFastForm
})

onMounted(() => {
  formRef.value = newWorkspaceFastForm.value
})
</script>
