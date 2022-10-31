<template>
  <v-menu
    v-model="projectMenu"
    class="askAnna-main-menu--wrapper"
    :close-on-content-click="false"
    offset-y
    nudge-bottom="10"
  >
    <template v-slot:activator="{ on }">
      <AskAnnaButton small dark class="white--text" text v-on="on">Projects</AskAnnaButton>
    </template>
    <AskAnnaRow class="pr-2 white askAnna-main-menu">
      <AskAnnaCol cols="5">
        <v-list dense>
          <v-list-item-group v-model="listMenu" color="primary" mandatory @change="handleChangeMenu">
            <v-list-item v-for="(item, i) in projectMenuItems" :key="i" aria-readonly>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </AskAnnaCol>
      <AskAnnaCol cols="7" class="pl-0">
        <AskAnnaAlert class="mb-0 pr-0" dense border="left" colored-border color="primary">
          <AskAnnaTextField
            v-if="!projectsStore.loading && (projects.length > 9 || search)"
            v-model="search"
            @input="handleOnSearch()"
            x-small
            dense
            outlined
            clearable
            single-line
            hide-details
            label="Search projects..."
          />

          <v-skeleton-loader v-if="projectsStore.loading" class="mx-auto" type="heading, text@9"></v-skeleton-loader>

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
                  v-for="item in projects.slice(0, 9)"
                  :key="item.short_uuid"
                  class="cursor--pointer"
                  @click="handleClick(item)"
                >
                  <td class="px-0">
                    <router-link
                      class="table-link table-link--unformated"
                      :to="{
                        name: 'workspace-project',
                        params: {
                          projectId: item.short_uuid,
                          packageId: item.package.short_uuid,
                          workspaceId: item.workspace.short_uuid
                        }
                      }"
                    >
                      <AskAnnaIcon class="pr-2">mdi-semantic-web</AskAnnaIcon>{{ item.name }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <AskAnnaFlex v-if="search && !projects.length && !isSearchProcessing" class="px-2 pt-2"
            >No results
          </AskAnnaFlex>
          <AskAnnaButton @click="handleCloseMenu" text plain small outlined class="mt-4 mb-0" :to="projectBtnOpt.to">{{
            projectBtnOpt.title
          }}</AskAnnaButton>
        </AskAnnaAlert>
      </AskAnnaCol>
    </AskAnnaRow>
  </v-menu>
</template>

<script setup lang="ts">
const router = useRouterAskAnna()
const projectsStore = useProjectsStore()

const explorBtnOpts = [
  { id: 0, to: { name: 'projects', query: { is_member: true } }, title: 'All my projects' },
  { id: 1, to: { name: 'projects' }, title: 'Explore all projects' }
]

const listMenu = ref(0)
const search = ref('')
const projectMenu = ref(false)
const projectMenuItems = ref([
  { text: 'My projects', icon: 'fas fa-project-diagram' },
  { text: 'Explore projects', icon: '  ' }
])
const isSearchProcessing = ref(false)

const projectsState = computed(() => projectsStore.projects.results)
const projectBtnOpt = computed(() => explorBtnOpts.find(el => el.id === listMenu.value))

const projects = computed(() => {
  let results = projectsState.value.filter(item => item.is_member === !listMenu.value)

  if (search.value) {
    results = results.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()))

    isSearchProcessing.value = false
  }

  return results
})

const handleChangeMenu = () => (search.value = '')

const handleCloseMenu = () => {
  projectMenu.value = false
  listMenu.value = 0
  search.value = ''
}

const handleClick = item => {
  handleCloseMenu()
  router.push({
    name: 'workspace-project',
    params: {
      projectId: item.short_uuid,
      packageId: item.package.short_uuid,
      workspaceId: item.workspace.short_uuid
    }
  })
}

const handleOnSearch = () => (isSearchProcessing.value = true)
</script>
