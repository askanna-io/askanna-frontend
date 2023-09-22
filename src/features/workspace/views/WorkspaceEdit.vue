<template>
  <AskAnnaBreadcrumbs :items="breadcrumbs" />
  <div class="px-0 sm:px-2">
    <AskAnnaCard
      v-if="isAllowedToView"
      :variant="!$vuetify.display.xs ? 'outlined' : 'flat'"
    >
      <AskAnnaCardTitle>
        <AskAnnaIcon
          class="pr-2"
          :icon="getIcon()"
        />{{ workspaceName }} - Edit mode
      </AskAnnaCardTitle>

      <AskAnnaCardTitle>Workspace profile</AskAnnaCardTitle>
      <div class="px-4">

        <div class="w-full sm:w-5/12 pb-2">
          <AskAnnaTextField
            required
            autofocus
            validate-on="blur"
            label="Workspace name"
            :model-value="workspaceState.name"
            :rules="[RULES.required('Workspace name is required')]"
            @update:modelValue="handleOnInput($event, 'name')"
          />
        </div>
        <div class="w-full">
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
        </div>
        <WorkspaceVisibility
          :visibility="workspaceState.visibility"
          @onChangeVisibility="handleOnChangeVisibility"
        />
        <div>
          <AskAnnaCardActions class="pl-0 my-2">
            <AskAnnaButton
              class="mr-1"
              :disabled="isStateNotChanged"
              @click="handlePreSave"
            >
              Save my changes
            </AskAnnaButton>
            <AskAnnaButton @click="handleClose">
              Cancel
            </AskAnnaButton>
          </AskAnnaCardActions>
        </div>
      </div>
    </AskAnnaCard>
    <template v-else>
      <AskAnnaAlert v-if="token">
        You are not allowed to edit this workspace. I can bring you back to the workspace
        <RouterLink
          :to="{ name: 'workspace' }"
          class="askanna-link"
        >{{ workspaceName }}</RouterLink>.
      </AskAnnaAlert>
      <AskAnnaAlert v-else>
        You are not allowed to open this page. I can bring you back to
        <RouterLink
          :to="{ path: '/' }"
          class="askanna-link"
        >the main page</RouterLink>.
      </AskAnnaAlert>
    </template>

    <WorkspaceVisibilityPopup
      :workspaceName="workspaceName"
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
const { RULES } = useValidationRules()
const { routerPush } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()
const { token, isAllowedToView } = useAskAnnaPermission()

const isStateNotChanged = ref(true)
const isVisibilityChanged = ref(false)
const isShowConfirmChangeVisibility = ref(false)
const breadcrumbs = useBreadcrumbs({ start: 0, end: 2 })

const workspace = computed(() => workspaceStore.workspace)

const workspaceState = ref({
  name: workspace.value.name,
  visibility: workspace.value.visibility,
  description: workspace.value.description
})

const workspaceName = ref(workspace.value.name)

watchOnce(workspace, () => {
  workspaceState.value = {
    name: workspace.value.name,
    visibility: workspace.value.visibility,
    description: workspace.value.description
  }
  workspaceName.value = workspace.value.name
})
const getIcon = () => (workspaceState.value.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')

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
    workspacesStore.menu.workspaces = {
      count: 0,
      next: '',
      previous: '',
      results: []
    } // reset workspaces in menu to load them on menu open
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
  routerPush({
    name: 'workspace',
    params: { workspaceId: workspace.value.suuid }
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