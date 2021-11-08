<template>
  <v-data-iterator :items="projects" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:header>
      <PublicProjectsToolbar
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
            @click="handleOpenProject(item)"
            :key="item.name + item.short_uuid + item.role"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <WorkspaceProjectCardItem
                :project="item"
                :hover="hover"
                :routeBackTo="'projects'"
                :workspaceName="item.workspace.name"
                :description="sanitizeHTML(item.description)"
              />
            </v-hover>
          </v-col>
        </v-row>
      </ask-anna-loading-progress>
    </template>
  </v-data-iterator>
</template>
<script>
import { orderBy } from 'lodash'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useProjectStore from '@/features/project/composition/useProjectStore'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { ref, computed, onBeforeMount, defineComponent } from '@vue/composition-api'

import PublicProjectsToolbar from '../components/public-projects/PublicProjectsToolbar.vue'
import WorkspaceProjectCardItem from '@/features/workspace/components/WorkspaceProjectCardItem.vue'

export default defineComponent({
  name: 'WorkspacePeopleList',

  components: {
    PublicProjectsToolbar,
    WorkspaceProjectCardItem
  },

  setup(_, context) {
    const router = useRouterAskAnna()
    const sanitizeHTML = useSanitizeHTML()
    const projectStore = useProjectStore()
    const workspaceStore = useWorkspaceStore()

    const projects = ref([])

    const projectsState = computed(() => projectStore.projects.value)
    const loading = computed(() => workspaceStore.loading.value.projects)
    const workspaces = computed(() => workspaceStore.workspaces.value.results)

    const fetchData = async () => {
      if (!workspaces.value.length) {
        await workspaceStore.actions.getWorkspaces()
      }
      await projectStore.getProjects()
      projects.value = [...projectsState.value.results]

      const { sort, sortby, is_member, searchtext, visibility } = context.root.$route.query

      handleFilterSearchAction({ sort, sortby, is_member, searchtext, visibility })
    }

    const handleOpenProject = project => {
      router.push({
        name: 'workspace-project-code',
        params: {
          projectId: project.short_uuid,
          workspaceId: project.workspace.short_uuid,
          title: `${project.name} - ${project.workspace.name}`,
          packageId: (project.package && project.package.short_uuid) || ''
        }
      })
    }

    const handleFilterSearchAction = ({ sort = 'desc', sortby = 'created', is_member, searchtext, visibility }) => {
      let results = [...projectsState.value.results]

      // filters
      if (visibility) {
        results = results.filter(item => item.visibility === visibility.toUpperCase())
      }

      if (typeof is_member !== 'undefined' && is_member !== '') {
        results = results.filter(item => item.is_member === is_member)
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

      router.push({
        name: 'projects',
        query: query
      })

      projects.value = results
    }

    const handleSearch = searchtext => {
      const { sort, sortby, visibility } = context.root.$route.query

      handleFilterSearchAction({ sort, sortby, searchtext, visibility })
    }

    const handleOnSort = ({ sort = 'desc', sortby = 'created' }) => {
      const { searchtext, visibility } = context.root.$route.query

      handleFilterSearchAction({ sort, sortby, searchtext, visibility })
    }

    const handleOnFilter = visibility => {
      const { sort, sortby, is_member, searchtext } = context.root.$route.query

      handleFilterSearchAction({ sort, sortby, is_member, searchtext, visibility })
    }

    const handleOnFilterMember = is_member => {
      const { sort, sortby, visibility, searchtext } = context.root.$route.query

      handleFilterSearchAction({ sort, sortby, is_member, searchtext, visibility })
    }

    onBeforeMount(() => fetchData())

    return {
      loading,
      projects,
      workspace: workspaceStore.workspace,
      workspaceProjects: workspaceStore.state.workspaceProjects,
      workspaceSettings: workspaceStore.state.workspaceSettings,

      sanitizeHTML,
      handleSearch,
      handleOnSort,
      handleOnFilter,
      handleOpenProject,
      handleOnFilterMember
    }
  }
})
</script>

<style scoped>
iframe {
  border: none;
}
.is-current-user {
  border: 1px solid var(--v-primary-base);
}
</style>
