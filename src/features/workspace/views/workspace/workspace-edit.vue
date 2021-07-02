<template>
  <div class="pt-2">
    <v-card flat outlined>
      <v-container class="ma-0 ml-1 pt-0" fluid>
        <v-row>
          <v-col cols="5">
            <v-text-field
              dense
              autofocus
              outlined
              required
              label="Workspace name"
              :value="workspaceState.name"
              :rules="[RULE.required('Workspace name is required')]"
              @input="handleOnInput($event, 'name')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0">
            <ask-anna-description
              cleared
              outlined
              onInputMode
              :headerHeight="215"
              :description="workspaceState.description"
              :title="'Workspace description (optional)'"
              @onChange="handleOnChange"
              @onChangeDescription="handleOnInput(handleClarifyDescription($event), 'description')"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <v-card-actions class="pl-0">
              <v-btn
                text
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                :disabled="isStateNotChanged"
                @click="handleSave"
              >
                Save my changes
              </v-btn>
              <v-btn @click="handleClose" small outlined text color="secondary" class="btn--hover">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
import {} from 'lodash'
import { set } from 'lodash'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useValidationRules from '@/core/composition/useValidationRules'

import { ref, watch, computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  name: 'workspace',

  setup(_, context) {
    const snackBar = useSnackBar()
    const workspaceStore = useWorkspaceStore()
    const validationRules = useValidationRules()

    const workspace = computed(() => workspaceStore.workspace.value)

    const isStateNotChanged = ref(true)
    const workspaceState = ref({
      name: workspace.value.name,
      description: workspace.value.description
    })

    const handleOnInput = (value, path) => {
      isStateNotChanged.value = false
      set(workspaceState.value, path, value)
    }

    const handleSave = async () => {
      const workspace = await workspaceStore.updateWorkspace({ ...workspaceState.value })
      if (workspace) {
        snackBar.showSnackBar({
          timeout: 2500,
          color: 'success',
          message: `The workspace ${workspace.name} was updated`
        })
        handleClose()
      }
    }

    const handleClose = () =>
      context.root.$router.push({
        name: 'workspace'
      })

    watch(workspace, workspace => {
      workspaceState.value = {
        name: workspace.name,
        description: workspace.description
      }
    })

    const handleOnChange = () => (isStateNotChanged.value = false)

    const handleChangeDescription = data => jobStore.changeJob(data)

    const handleClarifyDescription = val => val.replace('<p></p>', '')

    return {
      workspaceState,
      isStateNotChanged,
      RULE: validationRules.RULES,

      handleClose,
      handleSave,
      handleOnInput,
      handleOnChange,
      handleClarifyDescription,
      handleChangeDescription
    }
  }
})
</script>
