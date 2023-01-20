<template>
  <div>
    <VListGroup>
      <template v-slot:activator>
        <VListItemTitle @click="handleChangeMenu">Workspaces</VListItemTitle>
      </template>
      <template v-slot:appendIcon>
        <AskAnnaIcon @click="handleChangeMenu">mdi-chevron-down</AskAnnaIcon>
      </template>

      <AskAnnaCol cols="12" class="pa-0">
        <AskAnnaTextField
          v-if="workspacesStore.menu.isShowSearch || workspacesStore.menu.query.search"
          v-model="workspacesStore.menu.query.search"
          class="mx-1 mt-2"
          @input="debounceedSearch"
          x-small
          dense
          outlined
          clearable
          single-line
          hide-details
          label="Search workspaces..."
        />

        <VSkeletonLoader v-if="loading" class="mx-auto mt-3" type="heading, text@9" />

        <VList flat nav dense class="pt-0">
          <VListItem
            v-for="item in workspaces.slice(0, 5)"
            :key="item.suuid"
            :to="{
              name: 'workspace',
              params: {
                workspaceId: item.suuid
              }
            }"
            color="primary"
            @click="handleClickOnMenuItem"
          >
            <v-list-item-icon class="mr-2">
              <AskAnnaIcon>{{ getIcon(item) }}</AskAnnaIcon>
            </v-list-item-icon>

            <VListItemContent>
              {{ item.name }}
            </VListItemContent>
          </VListItem>
        </VList>

        <AskAnnaFlex
          v-if="workspacesStore.menu.query.search && !workspaces.length && !loading"
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

const workspacesStore = useWorkspacesStore()

const explorBtnOpts = [
  { id: 0, to: { name: 'workspaces', query: { is_member: true } }, title: 'All my workspaces' },
  {
    id: 1,
    to: { name: 'workspaces' },
    title: 'All workspaces'
  }
]

const loading = computed(() => workspacesStore.menu.loading)
const workspaces = computed(() => workspacesStore.menu.workspaces.results)

const handleSearch = async () => {
  await workspacesStore.getMenuWorkspaces({
    loading: true,
    params: { search: workspacesStore.menu.query.search }
  })
}

const debounceedSearch = debounce(handleSearch, 350)

const handleClickOnMenuItem = () => {
  workspacesStore.menu.query.search = null

  emits('onClose')
}

const getIcon = workspace => (workspace.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')

const handleChangeMenu = async () => {
  workspacesStore.menu.query.search = null
  await workspacesStore.getMenuWorkspaces({ params: { is_member: true }, loading: true })
}
</script>
