<template>
  <div class="pt-2">
    <v-card flat outlined v-if="isAllowedToView">
      <v-container class="ma-0 ml-1 pt-0" fluid>
        <v-row>
          <v-col cols="5">
            <div class="transition-swing text-h5 pt-2 pb-4 font-weight-bold">Workspace profile</div>
            <v-text-field
              dense
              autofocus
              outlined
              required
              label="Workspace name"
              :value="workspaceState.name"
              :rules="[RULES.required('Workspace name is required')]"
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
          <v-col cols="12">
            <div class="transition-swing text-h5 pt-2 pb-3 font-weight-bold">Workspace settings</div>
            <v-radio-group
              mandatory
              class="pt-0 mt-0"
              :value="workspaceState.visibility"
              @change="handleOnChangeVisibility($event, 'visibility')"
            >
              <template v-slot:label>
                <div class="text-subtitle-1 pt-0 font-weight-bold black--text">
                  Visibility
                </div>
              </template>
              <v-radio :ripple="false" value="PRIVATE">
                <template v-slot:label>
                  <div class="primary--black-text">Private</div>
                </template>
              </v-radio>
              <div class="pb-2 pl-8">
                Projects in this workspace can only be viewed by workspace or project members.
              </div>
              <v-radio :ripple="false" value="PUBLIC">
                <template v-slot:label>
                  <div class="primary--black-text">Public</div>
                </template>
              </v-radio>
              <div class="pl-8">
                Allow public projects that can be viewed by people without any authentication. Also the workspace name
                and description becomes publicly available.
              </div>
            </v-radio-group>
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
                @click="handlePreSave"
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
    <template v-else>
      <v-alert v-if="token" class="text-center" dense outlined>
        You are not allowed to edit this workspace. I can bring you back to the workspace
        <router-link :to="{ name: 'workspace' }" class="ask-anna-link">{{ workspace.name }}</router-link
        >.
      </v-alert>
      <v-alert v-else class="text-center" dense outlined>
        You are not allowed to open this page. I can bring you back to
        <router-link :to="{ path: '/' }" class="ask-anna-link">the main page</router-link>.
      </v-alert>
    </template>

    <ChangeWorkspaceVisibilityPopup
      :workspaceName="workspace.name"
      :value="isShowConfirmChangeVisibility"
      :visibility="workspaceState.visibility"
      @onCancel="handleOnCancel"
      @onConfirm="handleOnConfirm"
    />
  </div>
</template>
<script>
import { set } from 'lodash'
import usePermission from '@/core/composition/usePermission'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import { ref, computed, defineComponent } from '@vue/composition-api'
import useValidationRules from '@/core/composition/useValidationRules'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

import ChangeWorkspaceVisibilityPopup from '@/features/workspace/components/workspace-edit/ChangeWorkspaceVisibilityPopup'

export default defineComponent({
  name: 'workspace',

  components: {
    ChangeWorkspaceVisibilityPopup
  },

  setup(_, context) {
    const snackBar = useSnackBar()
    const { RULES } = useValidationRules()
    const workspaceStore = useWorkspaceStore()
    const { token, isAllowedToView } = usePermission()

    const isStateNotChanged = ref(true)
    const isVisibilityChanged = ref(false)
    const isShowConfirmChangeVisibility = ref(false)

    const workspace = computed(() => workspaceStore.workspace.value)
    const isMember = computed(() => workspaceStore.workspace.value.is_member)

    const workspaceState = ref({
      name: workspace.value.name,
      visibility: workspace.value.visibility,
      description: workspace.value.description
    })

    const handleOnInput = (value, path) => {
      isStateNotChanged.value = false
      set(workspaceState.value, path, value)
    }

    const handleOnChangeVisibility = value => {
      isStateNotChanged.value = false
      set(workspaceState.value, 'visibility', value)

      isVisibilityChanged.value = workspaceState.value.visibility !== workspace.value.visibility
    }

    const handlePreSave = () => {
      if (isVisibilityChanged.value) {
        isShowConfirmChangeVisibility.value = true

        return
      }
      handleSave()
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

    const handleOnConfirm = () => {
      isShowConfirmChangeVisibility.value = false
      handleSave()
    }

    const handleOnCancel = () => {
      isVisibilityChanged.value = false
      isShowConfirmChangeVisibility.value = false
      workspaceState.value.visibility = workspace.value.visibility
    }

    const handleOnChange = () => (isStateNotChanged.value = false)

    const handleClarifyDescription = val => val.replace('<p></p>', '')

    return {
      RULES,
      token,
      workspace,
      workspaceState,
      isAllowedToView,
      isStateNotChanged,
      isShowConfirmChangeVisibility,

      handleSave,
      handleClose,
      handlePreSave,
      handleOnInput,
      handleOnCancel,
      handleOnChange,
      handleOnConfirm,
      handleOnChangeVisibility,
      handleClarifyDescription
    }
  }
})
</script>
