<template>
  <v-toolbar
    color="grey lighten-4"
    flat
    dense
    class="br-r5"
    extension-height="50"
    :extended="$vuetify.breakpoint.xsOnly"
    :height="$vuetify.breakpoint.xsOnly ? '30px' : '48px'"
  >
    <v-toolbar-title>Explore workspaces</v-toolbar-title>
    <template :slot="$vuetify.breakpoint.xsOnly ? 'extension' : 'default'">
      <v-spacer v-if="!$vuetify.breakpoint.xsOnly" />
      <v-flex class="pr-2 block" :class="{ 'w-100p': $vuetify.breakpoint.xsOnly }">
        <v-text-field
          v-model="searchText"
          @input="debounceedSearch"
          small
          dense
          hide-details
          :placeholder="$vuetify.breakpoint.xsOnly ? 'Search...' : 'Search workspaces...'"
          :outlined="!$vuetify.breakpoint.xsOnly"
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
          <v-btn v-on="on" small data-test="workspace-menu-activate-btn"
            ><v-icon>mdi-sort</v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : 'Sort' }}</v-btn
          >
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
            <v-icon> mdi-filter-variant </v-icon>{{ $vuetify.breakpoint.xsOnly ? '' : 'Filters' }}
          </v-btn>
        </template>
        <v-row class="pa-2 white">
          <v-col class="d-flex pt-1 pb-1" cols="12">
            <v-card flat width="284">
              <v-card-subtitle class="pa-0">
                <h3>Workspace visibility</h3>
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
                <h3>Workspace membership</h3>
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
    </template>
  </v-toolbar>
</template>
<script setup lang="ts">
import { debounce } from 'lodash'
import { ref, computed } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

const routerAA = useRouterAskAnna()
const query = computed(() => routerAA.route.value.query)

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

const { sort = 'desc', sortby = 'created', searchtext } = query.value

const sortItems = [
  { title: 'Created (New to Old)', value: { sortby: 'created', sort: 'desc' } },
  { title: 'Created (Old to New)', value: { sortby: 'created', sort: 'asc' } },

  { title: 'Workspace name (A to Z)', value: { sortby: 'name', sort: 'asc' } },
  { title: 'Workspace name (Z to A)', value: { sortby: 'name', sort: 'desc' } }
]

const sortMenu = ref(false)
const filterMenu = ref(false)
const searchText = ref(searchtext)
const activeSort = ref(sortItems.findIndex(item => item.value.sort === sort && item.value.sortby === sortby))

const visibilityFilters = [
  { value: '', name: 'All workspaces' },
  { value: 'PUBLIC', name: 'Public workspaces' },
  { value: 'PRIVATE', name: 'Private workspaces' }
]

const isMemberFilters = [
  { value: '', name: 'All workspaces' },
  { value: true, name: "Workspaces I'm a member of" },
  { value: false, name: "Workspaces I'm not a member of" }
]

const activeMemberFilter = computed({
  get: () => {
    const { is_member = '' } = query.value

    return isMemberFilters.find(item => item.value === ISMEMBER[is_member])
  },
  set: async is_member => {
    handleChangeQuery({ ...query.value, is_member })
  }
})

const activeRoleFilter = computed({
  get: () => {
    const { visibility = 'all' } = query.value

    return visibilityFilters.find(item => item.value === VISIBILITIES[visibility])
  },
  set: async visibility => {
    handleChangeQuery({ ...query.value, visibility })
  }
})

const handleSearch = () => handleChangeQuery({ ...query.value, searchtext: searchText.value })
const debounceedSearch = debounce(handleSearch, 350)

const handleSort = () => {
  const params = typeof activeSort.value !== 'undefined' && sortItems[activeSort.value].value
  handleChangeQuery({ ...query.value, ...params })
}
const handleChangeQuery = ({ sort = 'desc', sortby = 'created', is_member, searchtext, visibility }) => {
  // we don't show the default value of sorting and filtering in URL params
  const query = {
    searchtext: searchtext || undefined,
    sort: sort === 'desc' ? undefined : sort,
    sortby: sortby === 'created' ? undefined : sortby,
    visibility: !visibility ? undefined : visibility.toLowerCase(),
    is_member: typeof is_member === 'undefined' || is_member === '' ? undefined : is_member
  }

  routerAA.replace({
    name: 'workspaces',
    query
  })
}
</script>
<style scoped>
.filter-label {
  font-size: 16px;
}
</style>