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
    <v-toolbar-title> {{ title }} - People</v-toolbar-title>
    <template :slot="$vuetify.breakpoint.xsOnly ? 'extension' : 'default'">
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
          <v-btn
            class="ml-1"
            :class="{ 'mr-5': $vuetify.breakpoint.xsOnly }"
            v-on="on"
            small
            data-test="workspace-menu-activate-btn"
          >
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
                v-model="activeRoleFilter"
                hide-details
                class="pt-0"
                no-data-text=""
                item-text="name"
                item-value="value"
                :items="roleFilters"
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
      <template v-if="workspacePeopleInviteCreate">
        <v-spacer />
        <PeopleInvitePopup :workspaceName="title" />
      </template>
    </template>
  </v-toolbar>
</template>
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  }
})

const permission = usePermission()
const peopleStore = usePeopleStore()

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
  { value: 'WA', name: 'Workspace admin' },
  { value: 'WM', name: 'Workspace member' },
  { value: 'WV', name: 'Workspace viewer' }
]

const statusFilters = [
  { value: '', name: 'All' },
  { value: 'invited', name: 'Invited' },
  { value: 'accepted', name: 'Accepted' }
]

const activeRoleFilter = computed({
  get: () => '',
  set: async value => {
    await peopleStore.setParams({ path: 'peopleParams.filter.role', value })
  }
})

const activeStatusFilter = computed({
  get: () => '',
  set: async value => {
    await peopleStore.setParams({ path: 'peopleParams.filter.status', value })
  }
})

const handleSort = async ({ value }) => await peopleStore.setParams({ path: 'peopleParams.sorting', value })
</script>
<style scoped>
.filter-label {
  font-size: 16px;
}
</style>
