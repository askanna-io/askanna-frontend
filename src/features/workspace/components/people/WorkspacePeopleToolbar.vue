<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title> {{ title }} - People</v-toolbar-title>
    <v-spacer />
    <v-spacer />
    <v-spacer />
    <v-menu
      v-model="sortMenu"
      class="workspace-menu"
      data-test="workspace-menu"
      transition="slide-y-transition"
      bottom
      :close-on-content-click="false"
      :nudge-width="100"
      nudge-bottom="10"
      offset-y
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
        <v-col class="d-flex" cols="12">
          <v-select
            v-model="activeFilter"
            :items="filters"
            item-text="name"
            item-value="value"
            label="account type"
            no-data-text=""
            dense
          />
        </v-col>
      </v-row>
    </v-menu>
  </v-toolbar>
</template>
<script>
import { ref, computed, reactive, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  name: 'WorkspaceToolbar',

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    const menu = ref(false)
    const activeSort = ref('')
    const sortMenu = ref(false)
    const filterMenu = ref(false)

    const sortItems = [
      { title: 'A-Z', value: 'user__name' },
      { title: 'Z-A', value: '-user__name' }
    ]
    const { workspaceId } = context.root.$route.params

    const handleSort = async ({ value }) => {
      await workspaceStore.setWorkspaceParams({ path: 'workspacePeopleParams.ordering', value })
      await workspaceStore.getWorkspacePeople({ workspaceId, params: { offset: 0, limit: 18 } })
    }

    const activeFilter = computed({
      get: () => '',
      set: async value => {
        await workspaceStore.setWorkspaceParams({ path: 'workspacePeopleParams.role', value })
        await workspaceStore.getWorkspacePeople({ workspaceId, params: { offset: 0, limit: 18 } })
      }
    })

    const filters = [
      { value: '', name: 'All types' },
      { value: 'WA', name: 'Admin' },
      { value: 'WM', name: 'Members' }
    ]

    return {
      menu,
      filters,
      sortMenu,
      sortItems,
      filterMenu,
      activeSort,
      activeFilter,
      handleSort
    }
  }
})
</script>
