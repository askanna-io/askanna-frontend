<template>
  <VMenu
    v-model="projectsStore.menu.isOpen"
    offset-y
    nudge-bottom="10"
    :close-on-content-click="false"
    class="askAnna-main-menu--wrapper"
  >
    <template v-slot:activator="{ on }">
      <AskAnnaButton small dark class="white--text" text v-on="on" @click="handleOpenMenu">Projects</AskAnnaButton>
    </template>
    <AskAnnaRow class="pr-2 white askAnna-main-menu">
      <AskAnnaCol cols="5">
        <VList dense>
          <VListItemGroup v-model="listMenu" mandatory color="primary" @change="handleChangeMenu">
            <VListItem v-for="(item, i) in menuItems" :key="i" aria-readonly>
              <VListItemContent>
                <VListItemTitle v-text="item.text" />
              </VListItemContent>
            </VListItem>
          </VListItemGroup>
        </VList>
      </AskAnnaCol>
      <AskAnnaCol cols="7" class="pl-0">
        <AskAnnaAlert class="mb-0 pr-0" dense border="left" colored-border color="primary">
          <AskAnnaTextField
            v-if="projectsStore.menu.isShowSearch || projectsStore.menu.query.search"
            v-model="projectsStore.menu.query.search"
            @input="debounceedSearch"
            x-small
            dense
            outlined
            clearable
            single-line
            hide-details
            label="Search projects..."
          />
          <VSkeletonLoader v-if="loading" class="mt-2 mx-auto" type="heading, text@9" />

          <VSimpleTable v-else dense fixed-header hide-default-footer class="ask-anna-table ask-anna-table--with-links">
            <template v-slot:default>
              <tbody>
                <tr v-for="item in projects" :key="item.suuid" class="cursor--pointer" @click="handleCloseMenu">
                  <td class="px-0">
                    <RouterLink
                      class="table-link table-link--unformated"
                      :to="{
                        name: 'workspace-project',
                        params: {
                          projectId: item.suuid,
                          packageId: item.package?.suuid,
                          workspaceId: item.workspace.suuid
                        }
                      }"
                    >
                      <AskAnnaIcon class="pr-2">mdi-semantic-web</AskAnnaIcon>{{ item.name }}</RouterLink
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </VSimpleTable>

          <AskAnnaFlex v-if="projectsStore.menu.query.search && !projects.length && !loading" class="px-2 pt-2"
            >No results</AskAnnaFlex
          >
          <AskAnnaButton @click="handleCloseMenu" text plain small outlined class="mt-4 mb-0" :to="projectBtnOpt.to">
            {{ projectBtnOpt.title }}
          </AskAnnaButton>
        </AskAnnaAlert>
      </AskAnnaCol>
    </AskAnnaRow>
  </VMenu>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'

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

const listMenu = ref(0)
const menuItems = ref([
  { text: 'My projects', icon: 'fas fa-project-diagram' },
  { text: 'Explore projects', icon: '  ' }
])

const loading = computed(() => projectsStore.menu.loading)
const projects = computed(() => projectsStore.menu.projects.results)
const projectBtnOpt = computed(() => explorBtnOpts.find(el => el.id === listMenu.value))

const handleChangeMenu = async () => {
  projectsStore.menu.query.search = null
  await projectsStore.getMenuProjects({ params: projectBtnOpt.value?.query, loading: true })
}

const handleCloseMenu = () => {
  listMenu.value = 0
  projectsStore.menu.isOpen = false
  projectsStore.menu.query.search = null
}

const handleSearch = async () => {
  await projectsStore.getMenuProjects({
    loading: true,
    params: { search: projectsStore.menu.query.search, ...projectBtnOpt.value.query }
  })
}

const debounceedSearch = debounce(handleSearch, 350)

const handleOpenMenu = async () => {
  if (projectsStore.menu.projects.results.length) return

  await projectsStore.getMenuProjects({ params: projectBtnOpt.value.query, loading: true })
}
</script>
