<template>
  <VMenu v-model="menu" :close-on-content-click="false" offset-y nudge-bottom="10">
    <template v-slot:activator="{ on }">
      <AskAnnaButton small dark class="white--text" text v-on="on">Workspaces</AskAnnaButton>
    </template>
    <AskAnnaRow class="pr-2 white askAnna-main-menu">
      <AskAnnaCol cols="5">
        <VList dense>
          <VListItemGroup v-model="listMenu" mandatory color="primary" @change="handleChangeMenu">
            <VListItem v-for="(item, i) in menuItems" :key="i" aria-readonly>
              <VListItemContent>
                <VListItemTitle v-text="item.text"></VListItemTitle>
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
              v-if="!loading && (workspaces.length > 9 || search)"
              v-model="search"
              @input="handleOnSearch()"
              x-small
              dense
              outlined
              single-line
              hide-details
              clearable
              label="Search workspaces..."
            />

            <v-skeleton-loader v-if="loading" class="mx-auto" type="heading, text@9"></v-skeleton-loader>

            <v-simple-table
              v-else
              dense
              fixed-header
              hide-default-footer
              class="ask-anna-table ask-anna-table--with-links"
            >
              <template v-slot:default>
                <tbody>
                  <tr
                    v-for="item in workspaces.slice(0, 9)"
                    :key="item.suuid"
                    class="cursor--pointer"
                    @click="handleClick(item)"
                  >
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
            </v-simple-table>

            <AskAnnaFlex v-if="search && !workspaces.length && !isSearchProcessing" class="px-2 pt-2"
              >No results
            </AskAnnaFlex>
            <AskAnnaButton
              @click="handleCloseMenu"
              text
              plain
              small
              outlined
              class="mt-4 mb-0"
              :to="projectBtnOpt.to"
              >{{ projectBtnOpt.title }}</AskAnnaButton
            >
          </AskAnnaAlert>
        </template>
      </AskAnnaCol>
    </AskAnnaRow>
  </VMenu>
</template>

<script setup lang="ts">
const { routerPush } = useRouterAskAnna()
const workspacesStore = useWorkspacesStore()

const explorBtnOpts = [
  { id: 0, to: { name: 'workspaces', query: { is_member: true } }, title: 'All my workspaces' },
  {
    id: 1,
    to: { name: 'workspaces' },
    title: 'Explore all workspaces'
  }
]

const listMenu = ref(0)
const menu = ref(false)
const search = ref('')
const menuItems = ref([
  { text: 'My workspaces', icon: 'fas fa-project-diagram' },
  { text: 'Explore workspaces', icon: '' },
  { text: 'Create workspace', icon: '' }
])
const isSearchProcessing = ref(false)

const loading = computed(() => workspacesStore.loadingAll)
const allWorkspacesState = computed(() => workspacesStore.allWorkspaces.results)
const projectBtnOpt = computed(() => explorBtnOpts.find(el => el.id === listMenu.value))

const workspaces = computed(() => {
  let results = allWorkspacesState.value.filter(item => item.is_member === !listMenu.value)

  if (search.value) {
    results = results.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()))
    isSearchProcessing.value = false
  }

  return results
})

const getIcon = workspace => (workspace.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')

const handleChangeMenu = () => (search.value = '')

const handleCloseMenu = () => {
  menu.value = false
  search.value = ''

  setTimeout(() => (listMenu.value = 0), 150)
}

const handleClick = item => {
  handleCloseMenu()
  routerPush({
    name: 'workspace',
    params: {
      workspaceId: item.suuid
    }
  })
}

const handleOnSearch = () => (isSearchProcessing.value = true)
</script>
