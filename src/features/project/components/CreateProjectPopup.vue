<template>
  <div class="text-center" v-if="projectCreate">
    <VMenu
      eager
      v-model="menu"
      @input="handleOpenMenu"
      offset-y
      :nudge-width="90"
      :nudge-bottom="5"
      :nudge-left="100"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <AskAnnaButton v-bind="attrs" v-on="on" small rounded class="mr-3">
          <AskAnnaIcon color="primary" left>mdi-plus</AskAnnaIcon>
          Create Project
        </AskAnnaButton>
      </template>
      <AskAnnaCard>
        <VForm ref="newProjectFastForm" @submit.prevent="handlerCreateProject">
          <AskAnnaCol cols="12" class="pb-0">
            <AskAnnaTextField
              v-model="projectStore.project.name"
              @input="handleOnInput"
              small
              dense
              outlined
              autofocus
              label="Project name"
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
              :disabled="!projectStore.project.name"
              @click="handlerCreateProject"
            >
              Create
            </AskAnnaButton>
            <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="handleMoreOptions">
              More options
            </AskAnnaButton>
            <AskAnnaButton small outlined text class="mr-1" @click="handleCancel">Cancel</AskAnnaButton>
          </AskAnnaCardActions>
        </VForm>
      </AskAnnaCard>
    </VMenu>
  </div>
</template>

<script setup lang="ts">
const permission = usePermission()
const projectStore = useProjectStore()
const { RULES } = useValidationRules()
const projectsStore = useProjectsStore()
const { route, routerPush } = useRouterAskAnna()

const menu = ref()
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
  if (!newProjectFastForm.value.validate()) {
    isFormValid.value = false

    return
  }

  await projectStore.createProjectShortWay(route.params.workspaceId)

  projectsStore.menu.projects = {
    count: 0,
    next: '',
    previous: '',
    results: []
  } // reset projects  to updated them on menu click

  resetValidation()
  nameRules.value = []
  menu.value = false
  isFormValid.value = false
  projectStore.resetProjectData()
  projectStore.project.name = ''
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

const handleOpenMenu = val => {
  isFormValid.value = true
  resetValidation()
  if (val) {
    nameRules.value = [RULES.required('Project name is required')]
  }
}
</script>
