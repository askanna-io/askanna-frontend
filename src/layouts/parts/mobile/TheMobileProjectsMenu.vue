<template>
  <VListGroup>
    <template v-slot:activator="{ props, isOpen }">
      <VListItem
        v-bind="props"
        :active="isOpen"
        active-color="primary"
        @click="handleOpenMenu"
      >Projects</VListItem>
    </template>

    <div>
      <AskAnnaTextField
        v-if="projectsStore.menu.isShowSearch || projectsStore.menu.query.search"
        clearable
        single-line
        hide-details
        class="mx-2 mt-2"
        @input="debounceedSearch"
        label="Search projects..."
        @click:clear="handleSearch"
        v-model="projectsStore.menu.query.search"
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
          v-for="item in projects.slice(0, 5)"
          :key="item.suuid"
          class="cursor-pointer"
        >
          <div class="relative flex items-center space-x-3 px-2 py-1 hover:bg-third">
            <div class="flex-shrink-0">
              <AskAnnaIcon
                color="secondary"
                icon="mdi-semantic-web"
              />
            </div>
            <div class="min-w-0 flex-1">
              <RouterLink
                :to="{
                  name: 'workspace-project',
                  params: {
                    projectId: item.suuid,
                    workspaceId: item.workspace.suuid
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
        v-if="projectsStore.menu.query.search && !projects.length && !loading"
        class="px-2 pt-2 pl-4 text--secondary"
      >No results</div>
      <div class="p-2">
        <AskAnnaButton
          v-for="projectBtnOpt of explorBtnOpts"
          @click="handleClickOnMenuItem"
          block
          class="mb-3"
          :active="false"
          :to="projectBtnOpt.to"
          :key="projectBtnOpt.title"
        >{{ projectBtnOpt.title }}</AskAnnaButton>
      </div>
    </div>
  </VListGroup>
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
