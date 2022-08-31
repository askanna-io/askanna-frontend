<template>
  <div>
    <AskAnnaLoadingProgress :type="'table-row'" :loading="loading">
      <v-data-iterator :items="workspaces" hide-default-footer :no-data-text="''" disable-pagination>
        <template v-slot:header>
          <WorkspacesToolbar />
        </template>
        <template v-slot:default="props">
          <v-row :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
            <v-col
              v-for="item in props.items"
              @click="handleOpenWorkspace(item)"
              :key="item.name + item.short_uuid"
              cols="12"
              sm="6"
              md="4"
              lg="4"
              :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
            >
              <v-hover v-slot:default="{ hover }" open-delay="200">
                <WorkspacesCardItem
                  :workspace="item"
                  :hover="hover"
                  :routeBackTo="'workspaces'"
                  :description="sanitizeHTML(item.description)"
                  @onOpenWorkspaceRemove="handleOpenWorkspaceRemove(item)"
                />
              </v-hover>
            </v-col>
          </v-row>
        </template>
        <template v-slot:no-data
          ><v-alert
            v-if="!loading"
            class="mt-2 text-center"
            dense
            outlined
            :class="{ 'ma-2': $vuetify.breakpoint.xsOnly }"
          >
            <template v-if="query.search">There are no workspaces for this search request.</template>
            <template v-else-if="query.visibility || query.is_member"
              >There are no workspaces for this filter request.</template
            >
          </v-alert></template
        >
      </v-data-iterator>
    </AskAnnaLoadingProgress>
    <WorkspaceConfirmDeletePopup
      :workspaceName="workspace.name"
      :value="deleteWorkspaceConfirmPopup"
      @onClose="handleCloseWorkspaceRemove"
      @onDeleteConfirm="handleDeleteConfirmWorkspace"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useWorkspaceStore } from '@/features/workspace/useWorkspaceStore'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'

import WorkspacesToolbar from '@/features/workspaces/components/WorkspacesToolbar.vue'
import WorkspacesCardItem from '@/features/workspaces/components/WorkspacesCardItem.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'
import WorkspaceConfirmDeletePopup from '@/features/workspace/components/WorkspaceConfirmDeletePopup.vue'

const routerAA = useRouterAskAnna()
const sanitizeHTML = useSanitizeHTML()
const workspaceStore = useWorkspaceStore()
const workspacesStore = useWorkspacesStore()

const workspace = ref({})
const deleteWorkspaceConfirmPopup = ref(false)

const query = computed(() => routerAA.route.value.query)
const loading = computed(() => workspacesStore.loadingAll)
const workspaces = computed(() => workspacesStore.getWorkspacesByParams(query.value))

const handleOpenWorkspace = workspace => {
  routerAA.push({
    name: 'workspace',
    params: {
      workspaceId: workspace.short_uuid,
      title: `${workspace.name}`
    }
  })
}

const handleOpenWorkspaceRemove = item => {
  workspace.value = item
  deleteWorkspaceConfirmPopup.value = true
}
const handleCloseWorkspaceRemove = () => (deleteWorkspaceConfirmPopup.value = false)

const handleDeleteConfirmWorkspace = async () => {
  await workspaceStore.deleteWorkspace(workspace.value)
  deleteWorkspaceConfirmPopup.value = false

  await workspacesStore.getAllWorkspaces()
}
</script>

<style scoped>
iframe {
  border: none;
}
.is-current-user {
  border: 1px solid var(--v-primary-base);
}
</style>
