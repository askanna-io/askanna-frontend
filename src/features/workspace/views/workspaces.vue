<template>
  <v-data-iterator :items="workspaces" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:header>
      <WorkspacesToolbar
        @onSort="handleOnSort"
        @onSearch="handleSearch"
        @onFilter="handleOnFilter"
        @onFilterMember="handleOnFilterMember"
      />
    </template>
    <template v-slot:default="props">
      <ask-anna-loading-progress :type="'table-row'" :loading="loading">
        <v-row>
          <v-col
            v-for="item in props.items"
            @click="handleOpenWorkspace(item)"
            :key="item.name + item.short_uuid"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <WorkspacesCardItem
                :workspace="item"
                :hover="hover"
                :routeBackTo="'workspaces'"
                :description="sanitizeHTML(item.description)"
              />
            </v-hover>
          </v-col>
        </v-row>
      </ask-anna-loading-progress>
    </template>
  </v-data-iterator>
</template>
<script setup lang="ts">
import { orderBy } from 'lodash'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspacesToolbar from '@/features/workspace/components/workspaces/WorkspacesToolbar.vue'
import WorkspacesCardItem from '@/features/workspace/components/workspaces/WorkspacesCardItem.vue'

const sanitizeHTML = useSanitizeHTML()
const routerAskAnna = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()

const workspaces = ref([])
const workspacesState = computed(() => workspaceStore.workspaces.value)
const loading = computed(() => workspaceStore.loading.value.projects)

const fetchData = async () => {
  await workspaceStore.actions.getWorkspaces({ membership: null })

  workspaces.value = [...workspacesState.value.results]

  const { sort, sortby, is_member, searchtext, visibility } = routerAskAnna.route.query

  handleFilterSearchAction({ sort, sortby, is_member, searchtext, visibility })
}

const handleOpenWorkspace = workspace => {
  routerAskAnna.push({
    name: 'workspace',
    params: {
      workspaceId: workspace.short_uuid,
      title: `${workspace.name}`
    }
  })
}

const handleFilterSearchAction = ({ sort = 'desc', sortby = 'created', is_member, searchtext, visibility }) => {
  let results = [...workspacesState.value.results]

  // filters
  if (visibility) {
    results = results.filter(item => item.visibility === visibility.toUpperCase())
  }

  if (typeof is_member !== 'undefined' && is_member !== '') {
    results = results.filter(item => String(item.is_member) === String(is_member))
  }

  // search
  if (searchtext) {
    results = results.filter(item => item.name.toLowerCase().includes(searchtext.toLowerCase()))
  }

  // sorting
  results = orderBy(results, [project => project[sortby].toLowerCase()], [sort])

  // we don't show the default value of sorting and filtering in URL params
  const query = {
    searchtext: searchtext || undefined,
    sort: sort === 'desc' ? undefined : sort,
    sortby: sortby === 'created' ? undefined : sortby,
    visibility: !visibility ? undefined : visibility.toLowerCase(),
    is_member: typeof is_member === 'undefined' || is_member === '' ? undefined : is_member
  }

  routerAskAnna.replace({
    name: 'workspaces',
    query: query
  })

  workspaces.value = results
}

const handleSearch = searchtext => {
  const { sort, sortby, visibility } = routerAskAnna.route.query

  handleFilterSearchAction({ sort, sortby, searchtext, visibility })
}

const handleOnSort = ({ sort = 'desc', sortby = 'created' }) => {
  const { searchtext, visibility } = routerAskAnna.route.query

  handleFilterSearchAction({ sort, sortby, searchtext, visibility })
}

const handleOnFilter = visibility => {
  const { sort, sortby, is_member, searchtext } = routerAskAnna.route.query

  handleFilterSearchAction({ sort, sortby, is_member, searchtext, visibility })
}

const handleOnFilterMember = is_member => {
  const { sort, sortby, visibility, searchtext } = routerAskAnna.route.query

  handleFilterSearchAction({ sort, sortby, is_member, searchtext, visibility })
}

onBeforeMount(() => fetchData())
</script>

<style scoped>
iframe {
  border: none;
}
.is-current-user {
  border: 1px solid var(--v-primary-base);
}
</style>
