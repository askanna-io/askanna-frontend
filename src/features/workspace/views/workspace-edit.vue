<template>
  <div class="pt-2">
    <AskAnnaCard v-if="isAllowedToView" flat :outlined="!$vuetify.breakpoint.xsOnly">
      <AskAnnaContainer class="ma-0 pt-0" fluid>
        <AskAnnaRow>
          <AskAnnaCol cols="12" sm="5">
            <div class="transition-swing text-h5 pt-2 pb-4 font-weight-bold">Workspace profile</div>
            <AskAnnaTextField
              dense
              autofocus
              outlined
              required
              label="Workspace name"
              :value="workspaceState.name"
              :rules="[RULES.required('Workspace name is required')]"
              @input="handleOnInput($event, 'name')"
            />
          </AskAnnaCol>
        </AskAnnaRow>
        <AskAnnaRow>
          <AskAnnaCol cols="12" class="pt-0">
            <AskAnnaDescription
              cleared
              outlined
              :height="480"
              :description="workspaceState.description"
              :title="'Workspace description (optional)'"
              @onChange="handleOnChange"
              @onSave="handleSaveDescription"
              @onChangeDescription="handleOnInput($event, 'description')"
            />
          </AskAnnaCol>
        </AskAnnaRow>
        <AskAnnaRow>
          <AskAnnaCol cols="12">
            <div class="transition-swing text-h5 pt-2 pb-3 font-weight-bold">Workspace settings</div>
            <v-radio-group
              mandatory
              hide-details
              class="pt-0 mt-0"
              :value="workspaceState.visibility"
              @change="handleOnChangeVisibility($event, 'visibility')"
            >
              <template v-slot:label>
                <div class="text-subtitle-1 pt-0 font-weight-bold black--text">Visibility</div>
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
          </AskAnnaCol>
        </AskAnnaRow>
        <AskAnnaRow>
          <AskAnnaCol class="pt-0">
            <AskAnnaCardActions class="pl-0">
              <AskAnnaButton
                text
                small
                outlined
                color="secondary"
                class="mr-1 btn--hover"
                :disabled="isStateNotChanged"
                @click="handlePreSave"
              >
                Save my changes
              </AskAnnaButton>
              <AskAnnaButton @click="handleClose" small outlined text color="secondary" class="btn--hover">
                Cancel
              </AskAnnaButton>
            </AskAnnaCardActions>
          </AskAnnaCol>
        </AskAnnaRow>
      </AskAnnaContainer>
    </AskAnnaCard>
    <template v-else>
      <AskAnnaAlert v-if="token" class="text-center" dense outlined>
        You are not allowed to edit this workspace. I can bring you back to the workspace
        <router-link :to="{ name: 'workspace' }" class="ask-anna-link">{{ workspace.name }}</router-link
        >.
      </AskAnnaAlert>
      <AskAnnaAlert v-else class="text-center" dense outlined>
        You are not allowed to open this page. I can bring you back to
        <router-link :to="{ path: '/' }" class="ask-anna-link">the main page</router-link>.
      </AskAnnaAlert>
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
<script setup lang="ts">
import { set } from 'lodash'

const snackBar = useSnackBar()
const { router } = useRouterAskAnna()
const { RULES } = useValidationRules()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()
const { token, isAllowedToView } = usePermission()

const isStateNotChanged = ref(true)
const isVisibilityChanged = ref(false)
const isShowConfirmChangeVisibility = ref(false)

const workspace = computed(() => workspaceStore.workspace)

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
    await workspacesStore.getAllWorkspaces() // call get all workspaces to updated them on menu
  }
}

const handleSaveDescription = async () => {
  const workspace = await workspaceStore.updateWorkspace({ description: workspaceState.value.description })

  if (workspace) {
    snackBar.showSnackBar({
      timeout: 2500,
      color: 'success',
      message: `The workspace ${workspace.name} was updated`
    })
  }
}

const handleClose = () =>
  router.push({
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
</script>
