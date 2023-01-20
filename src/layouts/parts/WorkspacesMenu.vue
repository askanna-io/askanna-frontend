<template>
  <VMenu v-model="workspacesStore.menu.isOpen" :close-on-content-click="false" offset-y nudge-bottom="10">
    <template v-slot:activator="{ on }">
      <AskAnnaButton small dark class="white--text" text v-on="on" @click="handleOpenMenu">Workspaces</AskAnnaButton>
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
        <template v-if="listMenu === 2">
          <AskAnnaAlert class="mb-0 pl-0 pt-0" dense border="left" :height="'100%'" colored-border color="primary">
            <WorkspaceCreateForm @onClose="handleCloseMenu" />
          </AskAnnaAlert>
        </template>
        <template v-else>
          <AskAnnaAlert class="mb-0" dense border="left" :height="'100%'" colored-border color="primary">
            <AskAnnaTextField
              v-if="workspacesStore.menu.isShowSearch || workspacesStore.menu.query.search"
              v-model="workspacesStore.menu.query.search"
              @input="debounceedSearch"
              dense
              x-small
              outlined
              clearable
              single-line
              hide-details
              label="Search workspaces..."
            />
            <VSkeletonLoader v-if="loading" class="mt-2 mx-auto" type="heading, text@9" />

            <VSimpleTable
              v-else
              dense
              fixed-header
              hide-default-footer
              class="ask-anna-table ask-anna-table--with-links"
            >
              <template v-slot:default>
                <tbody>
                  <tr v-for="item in workspaces" :key="item.suuid" class="cursor--pointer" @click="handleCloseMenu">
                    <td class="px-0">
                      <RouterLink
                        class="table-link table-link--unformated"
                        :to="{
                          name: 'workspace',
                          params: {
                            workspaceId: item.suuid
                          }
                        }"
                      >
                        <AskAnnaIcon class="pr-2">{{ getIcon(item) }}</AskAnnaIcon
                        >{{ item.name }}</RouterLink
                      >
                    </td>
                  </tr>
                </tbody>
              </template>
            </VSimpleTable>

            <AskAnnaFlex v-if="workspacesStore.menu.query.search && !workspaces.length && !loading" class="px-2 pt-2"
              >No results</AskAnnaFlex
            >
            <AskAnnaButton
              @click="handleCloseMenu"
              text
              plain
              small
              outlined
              class="mt-4 mb-0"
              :to="workspaceBtnOpt.to"
              >{{ workspaceBtnOpt.title }}</AskAnnaButton
            >
          </AskAnnaAlert>
        </template>
      </AskAnnaCol>
    </AskAnnaRow>
  </VMenu>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'

const workspacesStore = useWorkspacesStore()

const explorBtnOpts = [
  {
    id: 0,
    title: 'All my workspaces',
    query: { is_member: true },
    to: { name: 'workspaces', query: { is_member: true } }
  },
  {
    id: 1,
    to: { name: 'workspaces' },
    title: 'Explore all workspaces',
    query: { order_by: '-is_member', visibility: 'public' }
  }
]

const listMenu = ref(0)
const menuItems = ref([
  { text: 'My workspaces', icon: 'fas fa-project-diagram' },
  { text: 'Explore workspaces', icon: '' },
  { text: 'Create workspace', icon: '' }
])

const loading = computed(() => workspacesStore.menu.loading)
const workspaces = computed(() => workspacesStore.menu.workspaces.results)
const workspaceBtnOpt = computed(() => explorBtnOpts.find(el => el.id === listMenu.value))

const getIcon = workspace => (workspace.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')

const handleChangeMenu = async () => {
  workspacesStore.menu.query.search = null
  await workspacesStore.getMenuWorkspaces({ params: workspaceBtnOpt.value?.query, loading: true })
}

const handleCloseMenu = () => {
  listMenu.value = 0
  workspacesStore.menu.isOpen = false
  workspacesStore.menu.query.search = null
}

const handleSearch = async () => {
  await workspacesStore.getMenuWorkspaces({
    loading: true,
    params: { search: workspacesStore.menu.query.search, ...workspaceBtnOpt.value.query }
  })
}

const debounceedSearch = debounce(handleSearch, 350)

const handleOpenMenu = async () => {
  if (workspacesStore.menu.workspaces.results.length) return

  await workspacesStore.getMenuWorkspaces({ params: workspaceBtnOpt.value.query, loading: true })
}
</script>
