<template>
  <VForm ref="newWorkspaceFastForm" @submit.prevent="handlerCreateProject">
    <AskAnnaCol cols="12" class="pb-0">
      <AskAnnaTextField
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
    </AskAnnaCol>
    <AskAnnaCardActions>
      <AskAnnaButton
        text
        small
        outlined
        color="secondary"
        class="mr-1 btn--hover"
        :disabled="!workspaceStore.newWorkspace.name"
        @click="handlerCreate"
      >
        Create
      </AskAnnaButton>
      <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="handleMoreOptions">
        More options
      </AskAnnaButton>
      <AskAnnaButton v-if="showCancel" small outlined text class="mr-1" @click="handleCancel">Cancel</AskAnnaButton>
    </AskAnnaCardActions>
  </VForm>
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
const { RULES } = useValidationRules()
const { routerPush } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()

const formRef = ref(null)
const isFormValid = ref(true)
const newWorkspaceFastForm = ref(null)
const nameRules = ref([RULES.required('Workspace name is required')])

const handleMoreOptions = () => {
  emit('onClose')
  routerPush({
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
