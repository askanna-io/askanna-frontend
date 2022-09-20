<template>
  <div class="text-center" v-if="workspaceProjectCreate">
    <v-menu
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
        <v-btn v-bind="attrs" v-on="on" small rounded class="mr-3">
          <v-icon color="primary" left>mdi-plus</v-icon>
          Create Project
        </v-btn>
      </template>
      <v-card>
        <v-form ref="newProjectFastForm" @submit.prevent="handlerCreateProject">
          <v-col cols="12" class="pb-0">
            <v-text-field
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
          </v-col>
          <v-card-actions>
            <v-btn
              text
              small
              outlined
              color="secondary"
              class="mr-1 btn--hover"
              :disabled="!projectStore.project.name"
              @click="handlerCreateProject"
            >
              Create
            </v-btn>
            <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="handleMoreOptions">
              More options
            </v-btn>
            <v-btn small outlined text class="mr-1" @click="handleCancel">Cancel</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
const permission = usePermission()
const projectStore = useProjectStore()
const { RULES } = useValidationRules()
const projectsStore = useProjectsStore()
const { route, router } = useRouterAskAnna()

const menu = ref()
const isFormValid = ref(true)
const newProjectFastForm = ref(null)
const nameRules = ref([RULES.required('Project name is required')])

const workspaceProjectCreate = computed(() => permission.getFor(permission.labels.workspaceProjectCreate))

projectStore.resetProjectData()

const handleMoreOptions = () =>
  router.push({
    name: 'workspace-new-project',
    params: { workspaceId: route.params.workspaceId }
  })

const handlerCreateProject = async () => {
  if (!newProjectFastForm.value.validate()) {
    isFormValid.value = false

    return
  }

  await projectStore.createProjectShortWay(route.params.workspaceId)
  await projectsStore.getProjects() // call get all project to updated them on menu

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
