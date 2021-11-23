<template>
  <ask-anna-loading-progress :type="'table-row'" :loading="loading">
    <v-data-iterator :items="workspaces" hide-default-footer :no-data-text="''" disable-pagination>
      <template v-slot:header>
        <WorkspacesToolbar />
      </template>
      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            @click="handleOpenWorkspace(item)"
            :key="item.name + item.short_uuid"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <WorkspacesCardItem
                :workspace="item"
                :hover="hover"
                :routeBackTo="'workspaces'"
                :description="sanitizeHTML(item.description)"
              />
            </v-hover>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </ask-anna-loading-progress>
</template>
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'

import WorkspacesToolbar from '@/features/workspaces/components/WorkspacesToolbar.vue'
import WorkspacesCardItem from '@/features/workspaces/components/WorkspacesCardItem.vue'

const routerAA = useRouterAskAnna()
const sanitizeHTML = useSanitizeHTML()
const workspacesStore = useWorkspacesStore()

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
</script>

<style scoped>
iframe {
  border: none;
}
.is-current-user {
  border: 1px solid var(--v-primary-base);
}
</style>
