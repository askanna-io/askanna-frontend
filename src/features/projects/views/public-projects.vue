<template>
  <ask-anna-loading-progress :type="'table-row'" :loading="loading">
    <v-data-iterator :items="projects" hide-default-footer :no-data-text="''" disable-pagination>
      <template v-slot:header>
        <PublicProjectsToolbar />
      </template>
      <template v-slot:default="props">
        <v-row :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
          <v-col
            v-for="item in props.items"
            @click="handleOpenProject(item)"
            :key="item.name + item.short_uuid + item.role"
            cols="12"
            sm="6"
            md="4"
            lg="4"
            :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
          >
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <WorkspaceProjectCardItem
                :project="item"
                :hover="hover"
                :routeBackTo="'projects'"
                :workspaceName="item.workspace.name"
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
import { useProjectsStore } from '@/features/projects/useProjectsStore'

import PublicProjectsToolbar from '../components/public-projects/PublicProjectsToolbar.vue'
import WorkspaceProjectCardItem from '@/features/workspace/components/WorkspaceProjectCardItem.vue'

const routerAA = useRouterAskAnna()
const sanitizeHTML = useSanitizeHTML()
const projectsStore = useProjectsStore()

const loading = computed(() => projectsStore.loading)
const query = computed(() => routerAA.route.value.query)
const projects = computed(() => projectsStore.getProjectsByParams(query.value))

const handleOpenProject = project => {
  routerAA.push({
    name: 'workspace-project-code',
    params: {
      projectId: project.short_uuid,
      workspaceId: project.workspace.short_uuid,
      title: `${project.name} - ${project.workspace.name}`,
      packageId: (project.package && project.package.short_uuid) || ''
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
