<template>
  <workspace-project-list
    v-scroll="throttle(onScroll, 1000)"
    :items="projects"
    :queryParams="queryParams"
    :settings="workspaceStore.workspaceSettings"
    :workspaceName="workspaceStore.workspace.name"
  />
</template>
<script setup lang="ts">
import { throttle } from 'lodash'
import { computed } from '@vue/composition-api'
import useQuery from '@/core/composition/useQuery'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useWorkspaceStore } from '@/features/workspace/useWorkspaceStore'
import { useWorkspaceProjectsStore } from '@/features/workspace/useWorkspaceProjectsStore'
import WorkspaceProjectList from '@/features/workspace/components/WorkspaceProjectList.vue'

const routerAA = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const workspaceProjectsStore = useWorkspaceProjectsStore()

const { workspaceId } = routerAA.route.value.params

const queryParams = computed(() => routerAA.route.value.query)
const next = computed(() => workspaceProjectsStore.allWorkspaceProjects.next)
const projects = computed(() => workspaceProjectsStore.getProjectsByParams(queryParams.value))

const query = useQuery({
  next,
  limit: 18,
  offset: 99,
  queryParams,
  uuid: workspaceId,
  store: workspaceStore,
  storeAction: workspaceProjectsStore.getWorkpaceProjects
})

const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)
</script>
