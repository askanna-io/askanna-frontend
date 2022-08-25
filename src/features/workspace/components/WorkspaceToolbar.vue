<template>
  <v-toolbar
    flat
    dense
    color="grey lighten-4"
    class="br-r5 workspace-toolbar"
    :extended="$vuetify.breakpoint.xsOnly && isFilterOpen"
  >
    <v-row no-gutters>
      <v-col cols="8" sm="4" class="align-self-center">
        <v-flex class="d-flex">
          <v-toolbar-title v-if="isSignIn"> {{ title }}{{ isEditWorkspaceView ? ' - Edit mode' : '' }}</v-toolbar-title>
          <v-toolbar-title v-else-if="isWorkspacePublic && !isEditWorkspaceView"> {{ title }}</v-toolbar-title>
          <v-toolbar-title v-else>Not allowed</v-toolbar-title>
        </v-flex>
      </v-col>
      <v-col
        v-if="!$vuetify.breakpoint.xsOnly"
        cols="4"
        class="align-self-center"
        style="min-width: 100px; max-width: 100%"
      >
        <v-flex class="d-flex">
          <v-flex class="pr-2 block" :class="{ 'w-100p': $vuetify.breakpoint.xsOnly }">
            <v-text-field
              v-if="isFilterOpen"
              v-model="search"
              small
              dense
              outlined
              hide-details
              @input="debounceedSearch"
              :placeholder="$vuetify.breakpoint.xsOnly ? 'Search...' : 'Search projects...'"
            />
          </v-flex>
        </v-flex>
      </v-col>
      <v-col cols="4" class="align-self-center" style="min-width: 100px">
        <v-flex class="d-flex justify-end">
          <create-project-popup v-if="!isEditWorkspaceView && !$vuetify.breakpoint.xsOnly" />
          <v-btn @click="toggleFilter" small text icon
            ><v-icon :color="filterMenuStyle.color">{{ filterMenuStyle.icon }}</v-icon></v-btn
          >
          <WorkspaceToolbarMenu
            :isMember="isMember"
            :workspaceUuid="workspaceUuid"
            @onOpenWorkspaceRemove="handleOpenConfirmRemoveWorkspace"
          />
        </v-flex>
      </v-col>
    </v-row>

    <template v-if="isFilterOpen" v-slot:extension>
      <v-row no-gutters>
        <v-col cols="12" class="align-self-center">
          <v-flex class="d-flex" justify-center>
            <v-text-field
              v-if="isFilterOpen && $vuetify.breakpoint.xsOnly"
              v-model="search"
              small
              dense
              class="mr-2"
              hide-details
              @input="debounceedSearch"
              :placeholder="$vuetify.breakpoint.xsOnly ? 'Search...' : 'Search projects...'"
            />
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
                  ><v-icon :color="sortStyle.color">mdi-sort</v-icon
                  >{{ $vuetify.breakpoint.xsOnly ? '' : sortrTitle }}</v-btn
                >
              </template>
              <v-list>
                <v-list-item-group v-model="activeSort" color="primary" @change="handleSort('workspace')">
                  <v-list-item v-for="(item, index) in sortItems" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
            <v-menu
              v-if="isSignIn"
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
                  <v-icon :color="filterStyle.color">mdi-filter-variant</v-icon
                  >{{ $vuetify.breakpoint.xsOnly ? '' : filterTitle }}
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
                  </v-card>
                </v-col>
              </v-row>
            </v-menu>
          </v-flex>
        </v-col>
      </v-row>
    </template>
  </v-toolbar>
</template>
<script setup lang="ts">
import { useRouter } from '@/core/plugins/vue-hooks'
import { computed } from '@vue/composition-api'
import useSortFilter from '@/core/composition/useSortFilter'
import usePermission from '@/core/composition/usePermission'
import WorkspaceToolbarMenu from './WorkspaceToolbarMenu.vue'
import CreateProjectPopup from '@/features/project/components/CreateProjectPopup.vue'

defineProps({
  isMember: {
    type: Boolean,
    default: () => false
  },
  isWorkspacePublic: {
    type: Boolean,
    default: () => true
  },
  title: {
    type: String,
    default: ''
  },
  workspaceUuid: {
    type: String,
    default: ''
  },
  isCurrentUserAdmin: {
    type: Boolean,
    default: () => false
  }
})

const emit = defineEmits('onOpenWorkspaceRemove')

const {
  search,
  sortStyle,
  sortMenu,
  sortItems,
  activeSort,
  sortrTitle,

  filterTitle,
  filterMenu,
  filterStyle,
  isFilterOpen,
  filterMenuStyle,
  activeRoleFilter,
  visibilityFilters,

  handleSort,
  toggleFilter,
  debounceedSearch
} = useSortFilter('Project', 'projects')

const { route } = useRouter()
const permission = usePermission()

const isSignIn = computed(() => permission.token.value)
const isEditWorkspaceView = computed(() => route.value.name === 'workspace-edit')

const handleOpenConfirmRemoveWorkspace = () => emit('onOpenWorkspaceRemove')
</script>
<style lang="scss">
.mobile-view {
  .workspace-toolbar {
    .v-toolbar__content {
      padding-right: 8px;
    }
  }
}
.workspace-toolbar {
  .v-toolbar__content {
    padding-right: 2px;
  }
}
</style>
