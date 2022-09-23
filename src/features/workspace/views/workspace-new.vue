<template>
  <v-card class="mx-auto" flat :outlined="!$vuetify.breakpoint.xsOnly">
    <div class="askAnna-breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" class="pa-0 pl-3" :class="{ 'pa-4 pl-4': !$vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>
    <v-divider class="mt-1" />
    <v-card-title>
      <span class="title font-weight-light">Create a new workspace</span>
    </v-card-title>

    <v-card-text class="font-weight-bold">
      <p>
        Description: A workspace is where you can collaborate with your team, or yourself. Create projects, track your
        runs, invite other people and share what you have achieved.
      </p>
    </v-card-text>

    <v-divider />
    <v-container class="ma-0 pt-0" fluid>
      <v-row>
        <v-col cols="12" sm="5">
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
          <AskAnnaDescription
            cleared
            outlined
            :height="480"
            :description="workspaceState.description"
            :title="'Workspace description (optional)'"
            @onChange="handleOnChange"
            @onChangeDescription="handleOnInput($event, 'description')"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
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
            <div class="pb-2 pl-8">Projects in this workspace can only be viewed by workspace or project members.</div>
            <v-radio :ripple="false" value="PUBLIC">
              <template v-slot:label>
                <div class="primary--black-text">Public</div>
              </template>
            </v-radio>
            <div class="pl-8">
              Allow public projects that can be viewed by people without any authentication. Also the workspace name and
              description becomes publicly available.
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
              @click="handleSave"
            >
              CREATE WORKSPACE
            </v-btn>
            <v-btn @click="handleClose" small outlined text color="secondary" class="btn--hover">Cancel </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script setup lang="ts">
import { set } from 'lodash'

const snackBar = useSnackBar()
const { router } = useRouterAskAnna()
const { RULES } = useValidationRules()
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

    await workspacesStore.getAllWorkspaces() // call get all workspaces to updated them on menu
  }
}

const handleClose = () =>
  router.push({
    name: 'workspaces'
  })

const handleOnChange = () => (isStateNotChanged.value = false)
</script>
