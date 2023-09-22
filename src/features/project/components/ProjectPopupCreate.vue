<template>
  <div
    v-if="projectCreate"
    class="text-center pl-1"
  >
    <VMenu
      v-model="menu"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <AskAnnaButton
          v-bind="props"
          variant="elevated"
          colorIcon="primary"
          prependIcon="mdi-plus"
          class="mr-3 rounded-full"
        >
          Create Project
        </AskAnnaButton>
      </template>
      <AskAnnaCard class="pt-3 mt-2 px-3">
        <VForm
          ref="newProjectFastForm"
          @keyup.enter="handlerCreateProject"
          @submit.prevent="handlerCreateProject"
        >
          <AskAnnaTextField
            v-model="projectStore.project.name"
            autofocus
            :rules="nameRules"
            label="Project name"
            :hide-details="isFormValid"
            @update:modelValue="handleOnInput"
          />

          <AskAnnaCardActions class="pl-0">
            <AskAnnaButton
              class="mr-1"
              @click="handlerCreateProject"
              :disabled="!projectStore.project.name || loading"
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
              class="mr-1"
              @click="handleCancel"
            >
              Cancel</AskAnnaButton>
          </AskAnnaCardActions>
        </VForm>
      </AskAnnaCard>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
const projectStore = useProjectStore()
const { RULES } = useValidationRules()
const projectsStore = useProjectsStore()
const permission = useAskAnnaPermission()
const { route, routerPush } = useRouterAskAnna()

const menu = ref()
const loading = ref(false)
const isFormValid = ref(true)
const newProjectFastForm = ref(null)
const nameRules = ref([RULES.required('Project name is required')])

const projectCreate = computed(() => permission.getFor(permission.labels.projectCreate))

projectStore.resetProjectData()

const handleMoreOptions = () =>
  routerPush({
    name: 'workspace-new-project',
    params: { workspaceId: route.params.workspaceId }
  })

const handlerCreateProject = async () => {
  if (loading.value) return
  loading.value = true

  const { valid } = await newProjectFastForm.value.validate()
  if (!valid) {
    loading.value = false
    isFormValid.value = false

    return
  }

  const project = await projectStore.createProjectShortWay(route.params.workspaceId)

  projectsStore.menu.projects = {
    count: 0,
    next: '',
    previous: '',
    results: []
  } // reset projects  to updated them on menu click

  resetValidation()
  nameRules.value = []
  menu.value = false
  loading.value = false
  isFormValid.value = true
  projectStore.resetProjectData()
  projectStore.project.name = ''

  routerPush({
    name: 'workspace-project-code',
    params: {
      projectId: project?.suuid,
      workspaceId: route.params.workspaceId
    }
  })
}

const handleOnInput = val => {
  isFormValid.value = val ? true : false
}

const handleCancel = () => {
  nameRules.value = []
  menu.value = false
  isFormValid.value = true
  projectStore.resetProjectData()
}

const resetValidation = () => newProjectFastForm.value.resetValidation()
</script>