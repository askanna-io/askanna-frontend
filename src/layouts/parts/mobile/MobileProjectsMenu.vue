<template>
  <div>
    <VListGroup>
      <template v-slot:activator @click="handleOpenMenu">
        <VListItemTitle>Projects</VListItemTitle>
      </template>
      <template v-slot:appendIcon>
        <AskAnnaIcon @click="handleOpenMenu">mdi-chevron-down</AskAnnaIcon>
      </template>
      <AskAnnaCol cols="12" class="pa-0">
        <AskAnnaTextField
          v-if="projectsStore.menu.isShowSearch || projectsStore.menu.query.search"
          v-model="projectsStore.menu.query.search"
          class="mx-1 mt-2"
          @input="debounceedSearch"
          x-small
          dense
          outlined
          clearable
          single-line
          hide-details
          label="Search projects..."
        />

        <VSkeletonLoader v-if="loading" class="mx-auto mt-3" type="heading, text@9" />

        <VList v-else flat nav dense class="pt-0">
          <VListItem
            v-for="item in projects.slice(0, 5)"
            :key="item.suuid"
            :to="{
              name: 'workspace-project',
              params: {
                projectId: item.suuid,
                packageId: item.package?.suuid,
                workspaceId: item.workspace.suuid
              }
            }"
            color="primary"
            @click="handleClickOnMenuItem"
          >
            <v-list-item-icon class="mr-2">
              <AskAnnaIcon>mdi-semantic-web</AskAnnaIcon>
            </v-list-item-icon>

            <VListItemContent>
              {{ item.name }}
            </VListItemContent>
          </VListItem>
        </VList>

        <AskAnnaFlex
          v-if="projectsStore.menu.query.search && !projects.length && !loading"
          class="px-2 pt-2 pl-4 text--secondary"
          >No results</AskAnnaFlex
        >
        <AskAnnaCol class="pa-2">
          <AskAnnaButton
            v-for="projectBtnOpt of explorBtnOpts"
            @click="handleClickOnMenuItem"
            block
            text
            plain
            small
            outlined
            class="mb-3"
            :key="projectBtnOpt.title"
            :to="projectBtnOpt.to"
            >{{ projectBtnOpt.title }}</AskAnnaButton
          ></AskAnnaCol
        >
      </AskAnnaCol>
    </VListGroup>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'

const emits = defineEmits('onClose')

const projectsStore = useProjectsStore()

const explorBtnOpts = [
  { id: 0, to: { name: 'projects', query: { is_member: true } }, title: 'All my projects' },
  { id: 1, to: { name: 'projects' }, title: 'Explore all projects' }
]

const loading = computed(() => projectsStore.menu.loading)
const projects = computed(() => projectsStore.menu.projects.results)

const handleClickOnMenuItem = () => {
  projectsStore.menu.query.search = null

  emits('onClose')
}

const handleSearch = async () => {
  await projectsStore.getMenuProjects({
    loading: true,
    params: { search: projectsStore.menu.query.search }
  })
}

const debounceedSearch = debounce(handleSearch, 350)

const handleOpenMenu = async () => {
  if (projectsStore.menu.projects.results.length) return

  await projectsStore.getMenuProjects({ params: { is_member: true }, loading: true })
}
</script>
