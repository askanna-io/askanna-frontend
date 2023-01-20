<template>
  <AskAnnaCard class="mx-auto" flat :outlined="!$vuetify.breakpoint.xsOnly">
    <div class="askAnna-breadcrumbs">
      <VBreadcrumbs :items="breadcrumbs" class="pa-0 pl-3" :class="{ 'pa-4 pl-4': !$vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" exact>
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </div>
    <AskAnnaDivider class="mt-1" />
    <AskAnnaCardTitle>
      <span class="title font-weight-light">Create a new workspace</span>
    </AskAnnaCardTitle>

    <AskAnnaCardText class="font-weight-bold">
      <p>
        Description: A workspace is where you can collaborate with your team, or yourself. Create projects, track your
        runs, invite other people and share what you have achieved.
      </p>
    </AskAnnaCardText>

    <AskAnnaDivider />
    <AskAnnaContainer class="ma-0 pt-0" fluid>
      <AskAnnaRow>
        <AskAnnaCol cols="12" sm="5">
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
            @onChangeDescription="handleOnInput($event, 'description')"
          />
        </AskAnnaCol>
      </AskAnnaRow>
      <AskAnnaRow>
        <AskAnnaCol cols="12">
          <VRadioGroup
            mandatory
            hide-details
            class="pt-0 mt-0"
            :value="workspaceState.visibility"
            @change="handleOnChangeVisibility($event, 'visibility')"
          >
            <template v-slot:label>
              <div class="text-subtitle-1 pt-0 font-weight-bold black--text">Visibility</div>
            </template>
            <VRadio :ripple="false" value="PRIVATE">
              <template v-slot:label>
                <div class="primary--black-text">Private</div>
              </template>
            </VRadio>
            <div class="pb-2 pl-8">Projects in this workspace can only be viewed by workspace or project members.</div>
            <VRadio :ripple="false" value="PUBLIC">
              <template v-slot:label>
                <div class="primary--black-text">Public</div>
              </template>
            </VRadio>
            <div class="pl-8">
              Allow public projects that can be viewed by people without any authentication. Also the workspace name and
              description becomes publicly available.
            </div>
          </VRadioGroup>
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
              @click="handleSave"
            >
              CREATE WORKSPACE
            </AskAnnaButton>
            <AskAnnaButton @click="handleClose" small outlined text color="secondary" class="btn--hover"
              >Cancel
            </AskAnnaButton>
          </AskAnnaCardActions>
        </AskAnnaCol>
      </AskAnnaRow>
    </AskAnnaContainer>
  </AskAnnaCard>
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

    handleClose()
    workspaceStore.newWorkspace = { ...defaultWorkspace }

    workspacesStore.menu.workspaces = {
      count: 0,
      next: '',
      previous: '',
      results: []
    } // reset workspaces  to updated them on menu click
  }
}

const handleClose = () =>
  routerPush({
    name: 'workspaces'
  })

const handleOnChange = () => (isStateNotChanged.value = false)
</script>
