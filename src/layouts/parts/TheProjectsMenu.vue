<template>
  <VMenu
    :close-on-content-click="false"
    v-model="projectsStore.menu.isOpen"
  >
    <template v-slot:activator="{ props }">
      <AskAnnaButton
        color="white"
        variant="text"
        v-bind="props"
        class="white--text"
        @click="handleOpenMenu"
      >Projects</AskAnnaButton>
    </template>

    <AskAnnaCard class="flex gap-2 w-full mt-2">

      <VList
        mandatory
        class="w-48 pt-3 font-medium"
        density="compact"
        v-model="listMenu"
        @click:select="$event => handleChangeMenu($event)"
      >
        <VListItem
          v-for="(item, i) in menuItems"
          :key="i"
          :value="i"
          :active="listMenu === i"
        >
          <VListItemTitle
            v-text="item.text"
            class="font-medium"
          />
        </VListItem>
      </VList>

      <div
        :style="{ 'border-left': 'solid' }"
        class="border-l-3 border-primary rounded-l-sm my-3 pl-2 w-64 pb-1"
      >
        <AskAnnaTextField
          v-if="projectsStore.menu.isShowSearch || projectsStore.menu.query.search"
          clearable
          single-line
          hide-details
          persistent-clear
          class="clearable"
          @input="debounceedSearch"
          label="Search projects..."
          @click:clear="handleSearch"
          v-model="projectsStore.menu.query.search"
        />

        <template v-if="loading">
          <div class="pt-2">
            <div
              v-for="i in pageSize"
              :key="i"
              class="h-4 bg-third rounded-full max-w-[360px] mb-2.5"
            ></div>
          </div>
        </template>

        <template v-else>
          <ul
            role="list"
            class="relative z-0 divide-y divide-secondary list-none"
          >
            <li
              v-for="item in projects"
              :key="item.suuid"
              class="cursor-pointer"
            >
              <div class="relative flex items-center space-x-3 px-2 py-1 hover:bg-third">
                <div class="flex-shrink-0">
                  <AskAnnaIcon
                    color="on-surface"
                    :icon="getIcon(item)"
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
        </template>
        <div
          v-if="projectsStore.menu.query.search && !projects.length && !loading"
          class="px-2 pt-2"
        >No results</div>
        <AskAnnaButton
          @click="handleCloseMenu"
          :active="false"
          class="mt-4 mb-0"
          :to="projectBtnOpt.to"
        >
          {{ projectBtnOpt.title }}
        </AskAnnaButton>
      </div>
    </AskAnnaCard>
  </VMenu>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'

const { height } = useWindowSize()
const projectsStore = useProjectsStore()

const explorBtnOpts = [
  {
    id: 0,
    to: { name: 'projects', query: { is_member: true } },
    title: 'All my projects',
    query: { is_member: true }
  },
  {
    id: 1,
    to: { name: 'projects' },
    title: 'Explore all projects',
    query: { order_by: '-is_member', visibility: 'public' }
  }
]

const pageSize = ref(9)
const listMenu = ref(0)
const menuItems = ref([
  { text: 'My projects', icon: 'fas fa-project-diagram' },
  { text: 'Explore projects', icon: '  ' }
])

watch(height, (val) => {
  pageSize.value = val < 471 ?
    Math.round((val - 170) / 34) : 9
}, { immediate: true })

const loading = computed(() => projectsStore.menu.loading)
const projects = computed(() => projectsStore.menu.projects.results)
const projectBtnOpt = computed(() => explorBtnOpts.find(el => el.id === listMenu.value))

const handleChangeMenu = async (event) => {
  listMenu.value = event.id
  projectsStore.menu.query.search = null
  await projectsStore.getMenuProjects({ params: { ...projectBtnOpt.value?.query, page_size: pageSize.value }, loading: true })
}

const handleCloseMenu = () => {
  listMenu.value = 0
  projectsStore.menu.isOpen = false
  projectsStore.menu.query.search = null
}

const handleSearch = async () => {
  await projectsStore.getMenuProjects({
    loading: true,
    params: { search: projectsStore.menu.query.search, ...projectBtnOpt.value.query, page_size: pageSize.value }
  })
}

const debounceedSearch = debounce(handleSearch, 350)

const handleOpenMenu = async () => {
  if (projectsStore.menu.projects.results.length) return

  await projectsStore.getMenuProjects({ params: { ...projectBtnOpt.value.query, page_size: pageSize.value }, loading: true })
}

const getIcon = project => (project.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')
</script>
