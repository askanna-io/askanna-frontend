<template>
  <AskAnnaToolbar
    flat
    dense
    color="grey lighten-4"
    class="br-r5 workspace-toolbar"
    :extended="$vuetify.breakpoint.xsOnly && isFilterOpen"
  >
    <AskAnnaRow no-gutters>
      <AskAnnaCol cols="8" sm="4" class="align-self-center">
        <AskAnnaFlex class="d-flex">
          <AskAnnaToolbarTitle v-if="isSignIn">
            {{ title }}{{ isEditWorkspaceView ? ' - Edit mode' : '' }}</AskAnnaToolbarTitle
          >
          <AskAnnaToolbarTitle v-else-if="isWorkspacePublic && !isEditWorkspaceView"> {{ title }}</AskAnnaToolbarTitle>
          <AskAnnaToolbarTitle v-else>Not allowed</AskAnnaToolbarTitle>
        </AskAnnaFlex>
      </AskAnnaCol>
      <AskAnnaCol
        v-if="!$vuetify.breakpoint.xsOnly"
        cols="4"
        class="align-self-center"
        style="min-width: 100px; max-width: 100%"
      >
        <AskAnnaFlex class="d-flex">
          <AskAnnaFlex class="pr-2 block" :class="{ 'w-100p': $vuetify.breakpoint.xsOnly }">
            <AskAnnaTextField
              v-if="isFilterOpen"
              v-model="search"
              small
              dense
              outlined
              hide-details
              @input="debounceedSearch"
              :placeholder="$vuetify.breakpoint.xsOnly ? 'Search...' : 'Search projects...'"
            />
          </AskAnnaFlex>
        </AskAnnaFlex>
      </AskAnnaCol>
      <AskAnnaCol cols="4" class="align-self-center" style="min-width: 100px">
        <AskAnnaFlex class="d-flex justify-end">
          <CreateProjectPopup v-if="!isEditWorkspaceView && !$vuetify.breakpoint.xsOnly" />
          <AskAnnaButton @click="toggleFilter" small text icon
            ><AskAnnaIcon :color="filterMenuStyle.color">{{ filterMenuStyle.icon }}</AskAnnaIcon></AskAnnaButton
          >
          <WorkspaceToolbarMenu
            :isMember="isMember"
            :workspaceUuid="workspaceUuid"
            @onOpenWorkspaceRemove="handleOpenConfirmRemoveWorkspace"
          />
        </AskAnnaFlex>
      </AskAnnaCol>
    </AskAnnaRow>

    <template v-if="isFilterOpen" v-slot:extension>
      <AskAnnaRow no-gutters>
        <AskAnnaCol cols="12" class="align-self-center">
          <AskAnnaFlex class="d-flex" justify-center>
            <AskAnnaTextField
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
                <AskAnnaButton v-on="on" small data-test="workspace-menu-activate-btn"
                  ><AskAnnaIcon :color="sortStyle.color">mdi-sort</AskAnnaIcon
                  >{{ $vuetify.breakpoint.xsOnly ? '' : sortrTitle }}</AskAnnaButton
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
                <AskAnnaButton class="ml-1" v-on="on" small data-test="workspace-menu-activate-btn">
                  <AskAnnaIcon :color="filterStyle.color">mdi-filter-variant</AskAnnaIcon
                  >{{ $vuetify.breakpoint.xsOnly ? '' : filterTitle }}
                </AskAnnaButton>
              </template>
              <AskAnnaRow class="pa-2 white">
                <AskAnnaCol class="d-flex pt-1 pb-1" cols="12">
                  <AskAnnaCard flat width="284">
                    <AskAnnaCardSubTitle class="pa-0">
                      <h3>Project visibility</h3>
                    </AskAnnaCardSubTitle>
                    <AskAnnaSelect
                      v-model="activeRoleFilter"
                      hide-details
                      class="pt-0"
                      no-data-text=""
                      item-text="name"
                      item-value="value"
                      :items="visibilityFilters"
                    >
                    </AskAnnaSelect>
                  </AskAnnaCard>
                </AskAnnaCol>
              </AskAnnaRow>
            </v-menu>
          </AskAnnaFlex>
        </AskAnnaCol>
      </AskAnnaRow>
    </template>
  </AskAnnaToolbar>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router/composables'

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

const route = useRoute()
const permission = usePermission()

const isSignIn = computed(() => permission.token.value)
const isEditWorkspaceView = computed(() => route.name === 'workspace-edit')

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
