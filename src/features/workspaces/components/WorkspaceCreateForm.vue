<template>
  <VForm
    ref="newWorkspaceFastForm"
    @keyup.enter="handlerCreate"
    @submit.prevent="handlerCreate"
  >
    <AskAnnaTextField
      v-model="workspaceStore.newWorkspace.name"
      autofocus
      :rules="nameRules"
      label="Workspace name"
      :hide-details="isFormValid"
      @update:modelValue="handleOnInput"
    />
    <AskAnnaCardActions class="pl-0">
      <AskAnnaButton
        class="mr-1"
        @click="handlerCreate"
        :disabled="!workspaceStore.newWorkspace.name || loading"
      >
        Create
      </AskAnnaButton>
      <AskAnnaButton
        class="mr-1"
        @click="handleMoreOptions"
      >
        More options
      </AskAnnaButton>
      <AskAnnaButton
        v-if="showCancel"
        class="mr-1"
        :disabled="loading"
        @click="handleCancel"
      >Cancel</AskAnnaButton>
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

const formRef = ref(null)
const loading = ref(false)
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
  if (loading.value) return
  loading.value = true

  const { valid } = await formRef.value.validate()
  if (!valid) {
    loading.value = false
    isFormValid.value = false

    return
  }

  const workspace = await workspaceStore.createWorkspace({
    name: workspaceStore.newWorkspace.name,
    visibility: WorkspaceVisibility.PRIVATE
  })
  snackBar.showSnackBar({
    timeout: 2500,
    color: 'success',
    message: `The workspace ${workspaceStore.newWorkspace.name} was created`
  })

  handleCancel()
  resetValidation()
  loading.value = false

  routerPush({
    name: 'workspace',
    params: { workspaceId: workspace?.suuid }
  })
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