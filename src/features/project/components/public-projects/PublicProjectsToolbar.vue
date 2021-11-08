<template>
  <v-toolbar color="grey lighten-4" flat dense class="br-r5">
    <v-toolbar-title>Explore projects</v-toolbar-title>
    <v-spacer />
    <v-flex>
      <v-text-field
        v-model="searchText"
        @input="debounceedSearch"
        small
        dense
        outlined
        hide-details
        placeholder="Search projects..."
      ></v-text-field>
    </v-flex>
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
    >
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" small data-test="workspace-menu-activate-btn"><v-icon>mdi-sort</v-icon>Sort</v-btn>
      </template>
      <v-list>
        <v-list-item-group v-model="activeSort" color="primary" @change="handleSort()">
          <v-list-item v-for="(item, index) in sortItems" :key="index">
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
              <h3>Project visibility</h3>
            </v-card-subtitle>
            <v-select
              v-model="activeRoleFilter"
              hide-details
              class="pt-0"
              no-data-text=""
              item-text="name"
              item-value="value"
              :items="visibilityFilters"
            >
            </v-select>

            <v-card-subtitle class="pa-0 pt-4">
              <h3>Project membership</h3>
            </v-card-subtitle>
            <v-select
              v-model="activeMemberFilter"
              hide-details
              class="pt-0"
              no-data-text=""
              item-text="name"
              item-value="value"
              :items="isMemberFilters"
            >
            </v-select>
          </v-card>
        </v-col>
      </v-row>
    </v-menu>
  </v-toolbar>
</template>
<script>
import { debounce } from 'lodash'
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspaceToolbar',

  props: {
    title: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => ({
        sort: 'desc',
        sortby: 'modified',
        searchtext: ''
      })
    }
  },

  setup(_, context) {
    const ISMEMBER = {
      '': '',
      true: true,
      false: false
    }
    const VISIBILITIES = {
      all: '',
      public: 'PUBLIC',
      private: 'PRIVATE'
    }

    const { sort = 'desc', sortby = 'created', searchtext } = context.root.$route.query

    const sortItems = [
      { title: 'Last created first', value: { sortby: 'created', sort: 'desc' } },
      { title: 'Oldest created first', value: { sortby: 'created', sort: 'asc' } },

      { title: 'Project name (A to Z)', value: { sortby: 'name', sort: 'asc' } },
      { title: 'Project name (Z to A)', value: { sortby: 'name', sort: 'desc' } }
    ]

    const searchText = ref(searchtext)
    const menu = ref(false)
    const sortMenu = ref(false)
    const filterMenu = ref(false)
    const activeSort = ref(sortItems.findIndex(item => item.value.sort === sort && item.value.sortby === sortby))

    const visibilityFilters = [
      { value: '', name: 'All projects' },
      { value: 'PUBLIC', name: 'Public projects' },
      { value: 'PRIVATE', name: 'Private projects' }
    ]

    const isMemberFilters = [
      { value: '', name: 'All projects' },
      { value: true, name: "Projects I'm a member of" },
      { value: false, name: "Projects I'm not a member of" }
    ]

    const activeMemberFilter = computed({
      get: () => {
        const { is_member = '' } = context.root.$route.query

        return isMemberFilters.find(item => item.value === ISMEMBER[is_member])
      },
      set: async value => {
        context.emit('onFilterMember', value)
      }
    })

    const activeRoleFilter = computed({
      get: () => {
        const { visibility = 'all' } = context.root.$route.query

        return visibilityFilters.find(item => item.value === VISIBILITIES[visibility])
      },
      set: async value => {
        context.emit('onFilter', value)
      }
    })

    const handleSearch = () => context.emit('onSearch', searchText.value)
    const debounceedSearch = debounce(handleSearch, 350)

    const handleSort = () => {
      context.emit('onSort', typeof activeSort.value !== 'undefined' && sortItems[activeSort.value].value)
    }

    return {
      menu,
      sortMenu,
      sortItems,
      searchText,
      filterMenu,
      activeSort,
      isMemberFilters,
      activeRoleFilter,
      visibilityFilters,
      activeMemberFilter,

      handleSort,
      debounceedSearch
    }
  }
})
</script>
<style scoped>
.filter-label {
  font-size: 16px;
}
</style>
