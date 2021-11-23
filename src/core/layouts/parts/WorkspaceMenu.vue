<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y nudge-bottom="10">
    <template v-slot:activator="{ on }">
      <v-btn small dark class="white--text" text v-on="on">Workspaces</v-btn>
    </template>
    <v-row class="pr-2 white aa-main-menu">
      <v-col cols="5">
        <v-list dense>
          <v-list-item-group v-model="listMenu" mandatory color="primary" @change="handleChangeMenu">
            <v-list-item v-for="(item, i) in menuItems" :key="i" aria-readonly>
              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col cols="7" class="pl-0">
        <v-alert class="mb-0" dense border="left" colored-border color="primary">
          <v-text-field
            v-if="!loading && (workspaces.length > 9 || searchText)"
            v-model="searchText"
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
                  :key="item.short_uuid"
                  class="cursor--pointer"
                  @click="handleClick(item)"
                >
                  <td>
                    <router-link
                      class="table-link table-link--unformated"
                      :to="{
                        name: 'workspace',
                        params: {
                          workspaceId: item.short_uuid
                        }
                      }"
                      >{{ item.name }}</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-flex v-if="searchText && !workspaces.length && !isSearchProcessing" class="px-2 pt-2">No results </v-flex>
          <v-btn @click="handleCloseMenu" text plain small outlined class="mt-4 mb-0" :to="projectBtnOpt.to">{{
            projectBtnOpt.title
          }}</v-btn>
        </v-alert>
      </v-col>
    </v-row>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'

const router = useRouterAskAnna()
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
const searchText = ref('')
const menuItems = ref([
  { text: 'My workspaces', icon: 'fas fa-project-diagram' },
  { text: 'Explore workspaces', icon: '' }
])
const isSearchProcessing = ref(false)

const loading = computed(() => workspacesStore.loadingAll)
const allWorkspacesState = computed(() => workspacesStore.allWorkspaces.results)
const projectBtnOpt = computed(() => explorBtnOpts.find(el => el.id === listMenu.value))

const workspaces = computed(() => {
  let results = allWorkspacesState.value.filter(item => item.is_member === !listMenu.value)

  if (searchText.value) {
    results = results.filter(item => item.name.toLowerCase().includes(searchText.value.toLowerCase()))
    isSearchProcessing.value = false
  }

  return results
})

const handleChangeMenu = () => (searchText.value = '')

const handleCloseMenu = () => {
  menu.value = false
  listMenu.value = 0
  searchText.value = ''
}

const handleClick = item => {
  handleCloseMenu()
  router.push({
    name: 'workspace',
    params: {
      workspaceId: item.short_uuid
    }
  })
}

const handleOnSearch = () => (isSearchProcessing.value = true)
</script>
