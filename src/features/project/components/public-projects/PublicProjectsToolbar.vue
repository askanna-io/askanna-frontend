<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title>Explore projects</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-menu
      v-model="sortMenu"
      bottom
      offset-y
      nudge-bottom="10"
      :nudge-width="100"
      class="workspace-menu"
      data-test="workspace-menu"
      transition="slide-y-transition"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" small data-test="workspace-menu-activate-btn"><v-icon>mdi-sort</v-icon>Sort</v-btn>
      </template>
      <v-list>
        <v-list-item-group v-model="activeSort" color="primary">
          <v-list-item v-for="(item, index) in sortItems" :key="index" @click="handleSort(item)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
    <v-menu
      v-model="filterMenu"
      transition="slide-y-transition"
      :close-on-content-click="false"
      :nudge-width="200"
      :nudge-height="300"
      offset-y
      nudge-bottom="10"
    >
      <template v-slot:activator="{ on }">
        <v-btn class="ml-1" v-on="on" small data-test="workspace-menu-activate-btn">
          <v-icon> mdi-filter-variant </v-icon>Filters
        </v-btn>
      </template>
      <v-row class="pa-2 white">
        <v-col class="d-flex pt-1 pb-1" cols="12">
          <v-card flat width="284">
            <v-card-subtitle class="pa-0">
              <h3>Account types</h3>
            </v-card-subtitle>
            <v-select
              hide-details
              v-model="activeRoleFilter"
              :items="roleFilters"
              item-text="name"
              item-value="value"
              no-data-text=""
              class="pt-0"
            >
            </v-select>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="pa-2 white">
        <v-col class="d-flex pt-1 pb-1" cols="12">
          <v-card flat width="284">
            <v-card-subtitle class="pa-0">
              <h3>Account status</h3>
            </v-card-subtitle>
            <v-select
              hide-details
              v-model="activeStatusFilter"
              :items="statusFilters"
              item-text="name"
              item-value="value"
              no-data-text=""
              class="pt-0"
            >
            </v-select>
          </v-card>
        </v-col>
      </v-row>
    </v-menu>
  </v-toolbar>
</template>
<script>
import usePermission from '@/core/composition/usePermission'
import { ref, computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  name: 'WorkspaceToolbar',

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  setup() {
    const permission = usePermission()
    const workspaceStore = useWorkspaceStore()

    const menu = ref(false)
    const activeSort = ref('')
    const sortMenu = ref(false)
    const filterMenu = ref(false)

    const workspacePeopleInviteCreate = computed(() => permission.getFor(permission.labels.workspacePeopleInviteCreate))

    const sortItems = [
      { title: 'A to Z', value: { sortBy: 'name', sort: 1 } },
      { title: 'Z to A', value: { sortBy: 'name', sort: -1 } }
    ]

    const roleFilters = [
      { value: '', name: 'All types' },
      { value: 'WA', name: 'Admin' },
      { value: 'WM', name: 'Member' }
    ]

    const statusFilters = [
      { value: '', name: 'All' },
      { value: 'invited', name: 'Invited' },
      { value: 'accepted', name: 'Accepted' }
    ]

    const activeRoleFilter = computed({
      get: () => '',
      set: async value => {
        await workspaceStore.setWorkspaceParams({ path: 'workspacePeopleParams.filter.role', value })
      }
    })

    const activeStatusFilter = computed({
      get: () => '',
      set: async value => {
        await workspaceStore.setWorkspaceParams({ path: 'workspacePeopleParams.filter.status', value })
      }
    })

    const handleSort = async ({ value }) =>
      await workspaceStore.setWorkspaceParams({ path: 'workspacePeopleParams.sorting', value })

    return {
      menu,
      sortMenu,
      sortItems,
      filterMenu,
      activeSort,
      roleFilters,
      statusFilters,
      activeRoleFilter,
      activeStatusFilter,
      workspacePeopleInviteCreate,

      handleSort
    }
  }
})
</script>
<style scoped>
.filter-label {
  font-size: 16px;
}
</style>
