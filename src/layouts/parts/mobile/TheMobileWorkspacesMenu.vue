<template>
  <VListGroup>
    <template v-slot:activator="{ props, isOpen }">
      <VListItem
        v-bind="props"
        :active="isOpen"
        active-color="primary"
        @click="handleChangeMenu"
      >Workspaces</VListItem>
    </template>
    <div>
      <AskAnnaTextField
        v-if="workspacesStore.menu.isShowSearch || workspacesStore.menu.query.search"
        v-model="workspacesStore.menu.query.search"
        class="mx-2 mt-2"
        clearable
        single-line
        hide-details
        @input="debounceedSearch"
        @click:clear="handleSearch"
        label="Search workspaces..."
      />

      <template v-if="loading">
        <div class="px-4 pt-4">
          <div
            v-for="i in 5"
            :key="i"
            class="h-4 w-full mx-auto bg-third rounded-full mb-3"
          ></div>
        </div>
      </template>

      <ul
        v-else
        role="list"
        class="ml-3 relative z-0 divide-y divide-secondary list-none "
      >
        <li
          v-for="item in workspaces.slice(0, 5)"
          :key="item.suuid"
          class="cursor-pointer"
        >
          <div class="relative flex items-center space-x-3 px-2 py-1 hover:bg-third">
            <div class="flex-shrink-0">
              <AskAnnaIcon
                color="secondary"
                :icon="getIcon(item)"
              />
            </div>
            <div class="min-w-0 flex-1">
              <RouterLink
                :to="{
                    name: 'workspace',
                    params: {
                      workspaceId: item.suuid
                    }
                  }"
                class="focus:outline-none no-underline text-secondary"
              >
                <span
                  aria-hidden="true"
                  class="absolute inset-0"
                ></span>
                <p class="truncate">{{ item.name }}</p>
              </RouterLink>
            </div>
          </div>
        </li>
      </ul>

      <div
        v-if="workspacesStore.menu.query.search && !workspaces.length && !loading"
        class="flex px-2 pt-2 pl-4"
      >No results</div>
      <div class="p-2">
        <AskAnnaButton
          v-for="projectBtnOpt of explorBtnOpts"
          block
          class="mb-3"
          :active="false"
          :to="projectBtnOpt.to"
          :key="projectBtnOpt.title"
          @click="handleClickOnMenuItem"
        >{{ projectBtnOpt.title }}</AskAnnaButton>
      </div>
    </div>
  </VListGroup>
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
