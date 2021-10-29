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
              v-model="projectName"
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
              :disabled="!projectName"
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

<script>
import usePermission from '@/core/composition/usePermission'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, defineComponent } from '@vue/composition-api'
import useValidationRules from '@/core/composition/useValidationRules'
import useProjectStore from '@/features/project/composition/useProjectStore'

export default defineComponent({
  name: 'CreateProjectPopup',

  setup(_, context) {
    const router = useRouterAskAnna()
    const permission = usePermission()
    const projectStore = useProjectStore()

    const workspaceProjectCreate = computed(() => permission.getFor(permission.labels.workspaceProjectCreate))
    const { RULES } = useValidationRules()

    const menu = ref()
    const isFormValid = ref(true)
    const newProjectFastForm = ref(null)
    const nameRules = ref([RULES.required('Project name is required')])

    projectStore.resetProjectData()

    const handleMoreOptions = () =>
      router.push({
        name: 'workspace-new-project',
        params: { workspaceId: context.root.$route.params.workspaceId }
      })

    const handlerCreateProject = async () => {
      if (!newProjectFastForm.value.validate()) {
        isFormValid.value = false

        return
      }

      await projectStore.createProjectShortWay(context.root.$route.params.workspaceId)

      resetValidation()
      nameRules.value = []
      menu.value = false
      isFormValid.value = false
      projectStore.resetProjectData()
      projectStore.projectName.value = ''
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

    return {
      menu,
      nameRules,
      isFormValid,
      newProjectFastForm,
      workspaceProjectCreate,
      projectName: projectStore.projectName,

      handleCancel,
      handleOnInput,
      handleOpenMenu,
      handleMoreOptions,
      handlerCreateProject
    }
  }
})
</script>
