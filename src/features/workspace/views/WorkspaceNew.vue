<template>
  <AskAnnaBreadcrumbs :items="breadcrumbs" />
  <div class="px-0 sm:px-2">
    <AskAnnaCard :variant="!$vuetify.display.xs ? 'outlined' : 'flat'">
      <AskAnnaCardTitle>
        <AskAnnaIcon
          class="pr-2"
          :icon="getIcon()"
        />Create a new workspace
      </AskAnnaCardTitle>
      <AskAnnaCardText>
        <p>
          A workspace is where you can collaborate with your team, or yourself. Create projects, track your
          runs, invite
          other people and share what you have achieved. In <a
            href="https://docs.askanna.io/workspace/"
            target="_blank"
          >the documentation</a> you can read more about the AskAnna
          workspace.
        </p>
      </AskAnnaCardText>

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
            @onChangeDescription="handleOnInput($event, 'description')"
          />
        </div>
        <WorkspaceVisibility
          :visibility="workspaceState.visibility"
          @onChangeVisibility="handleOnChangeVisibility"
        />
        <AskAnnaCardActions class="pl-0 my-2">
          <AskAnnaButton
            class="mr-1"
            :disabled="isStateNotChanged"
            @click="handleSave"
          >
            CREATE WORKSPACE
          </AskAnnaButton>
          <AskAnnaButton @click="handleClose">Cancel</AskAnnaButton>
        </AskAnnaCardActions>
      </div>
    </AskAnnaCard>
  </div>
</template>
<script setup lang="ts">
import { set } from 'lodash'

const snackBar = useSnackBar()
const { RULES } = useValidationRules()
const { routerPush } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()

const isVisibilityChanged = ref(false)
const isStateNotChanged = ref(!workspaceStore.newWorkspace.name)

const breadcrumbs = computed(() => [
  {
    title: 'Workspaces',
    to: `/workspaces`,
    disabled: false
  },
  {
    title: 'Create new workspace',
    to: '',
    disabled: true
  }
])

const workspaceState = ref({
  name: workspaceStore.newWorkspace.name,
  visibility: workspaceStore.newWorkspace.visibility,
  description: workspaceStore.newWorkspace.description
})

const handleOnInput = (value, path) => {
  isStateNotChanged.value = false
  set(workspaceState.value, path, value)
}

const handleOnChangeVisibility = value => {
  isStateNotChanged.value = false
  set(workspaceState.value, 'visibility', value)

  isVisibilityChanged.value = workspaceState.value.visibility !== workspaceStore.workspace.visibility
}

const handleSave = async () => {
  const workspace = await workspaceStore.createWorkspace({ ...workspaceState.value })

  if (workspace) {
    snackBar.showSnackBar({
      timeout: 2500,
      color: 'success',
      message: `The workspace ${workspace.name} was created`
    })


    workspaceStore.newWorkspace = { ...defaultWorkspace }

    workspacesStore.menu.workspaces = {
      count: 0,
      next: '',
      previous: '',
      results: []
    } // reset workspaces  to updated them on menu click

    routerPush({
      name: 'workspace',
      params: { workspaceId: workspace?.suuid }
    })
  }
}

const handleClose = () =>
  routerPush({
    name: 'workspaces'
  })

const getIcon = () => (workspaceState.value.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')

const handleOnChange = () => (isStateNotChanged.value = false)
</script>
