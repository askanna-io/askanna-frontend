<template>
  <v-data-iterator
    :items="workspaceProjects.results"
    hide-default-footer
    :no-data-text="''"
    disable-pagination
    v-scroll="throttle(onScroll, 1000)"
  >
    <template v-slot:header>
      <PublicProjectsToolbar />
    </template>
    <template v-slot:default="props">
      <ask-anna-loading-progress :type="'table-row'" :loading="loading">
        <v-row>
          <v-col
            v-for="item in props.items"
            @click="handleSelectPeople(item)"
            :key="item.name + item.short_uuid + item.role"
            cols="12"
            sm="4"
            md="3"
            lg="3"
            xl="3"
          >
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <PublicProjectCardItem
                :project="item"
                :hover="hover"
                :workspaceName="'workspaceName'"
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
import { throttle } from 'lodash'
import useQuery from '@/core/composition/useQuery'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import { ref, computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

import PublicProjectsToolbar from '../components/public-projects/PublicProjectsToolbar.vue'
import PublicProjectCardItem from '../components/public-projects/PublicProjectCardItem.vue'

export default defineComponent({
  name: 'WorkspacePeopleList',

  components: {
    PublicProjectCardItem,
    PublicProjectsToolbar
  },

  setup() {
    const sanitizeHTML = useSanitizeHTML()
    const workspaceStore = useWorkspaceStore()
    const loading = computed(() => workspaceStore.loading.value.projects)

    const next = computed(() => workspaceStore.state.workspaceProjects.value.next)

    const query = useQuery({
      next,
      limit: 18,
      offset: 99,
      store: workspaceStore,
      storeAction: workspaceStore.actions.getWorkpaceProjects
    })

    const onScroll = e => query.onScroll(e.target.documentElement.scrollTop)

    return {
      loading,
      throttle,
      onScroll,
      workspace: workspaceStore.workspace,
      workspaceProjects: workspaceStore.state.workspaceProjects,
      workspaceSettings: workspaceStore.state.workspaceSettings,

      sanitizeHTML
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
