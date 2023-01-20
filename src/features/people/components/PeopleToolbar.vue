<template>
  <AskAnnaToolbar
    flat
    dense
    class="br-r5"
    extension-height="50"
    color="grey lighten-4"
    :extended="$vuetify.breakpoint.xsOnly && isFilterOpen"
  >
    <AskAnnaRow no-gutters>
      <AskAnnaCol cols="8" sm="4" class="align-self-center">
        <AskAnnaFlex class="d-flex">
          <AskAnnaToolbarTitle> {{ title }} - People</AskAnnaToolbarTitle>
        </AskAnnaFlex>
      </AskAnnaCol>
      <AskAnnaCol
        v-if="!$vuetify.breakpoint.xsOnly"
        cols="4"
        class="align-self-center"
        style="min-width: 100px; max-width: 100%"
      >
        <AskAnnaFlex class="d-flex">
          <AskAnnaTextField
            v-if="isFilterOpen"
            v-model="search"
            @input="debounceedSearch"
            small
            dense
            outlined
            hide-details
            :placeholder="$vuetify.breakpoint.xsOnly ? 'Search...' : 'Search people...'"
        /></AskAnnaFlex>
      </AskAnnaCol>
      <AskAnnaCol cols="4" class="align-self-center" style="min-width: 100px">
        <AskAnnaFlex class="d-flex justify-end">
          <template v-if="workspacePeopleInviteCreate">
            <AskAnnaSpacer />
            <PeopleInvitePopup :workspaceName="title" :workspaceId="workspaceId" />
          </template>
          <AskAnnaButton @click="toggleFilter" small text icon
            ><AskAnnaIcon :color="filterMenuStyle.color">{{ filterMenuStyle.icon }}</AskAnnaIcon></AskAnnaButton
          >
          <WorkspacesToolbarMenu />
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
              @input="debounceedSearch"
              small
              dense
              hide-details
              class="mr-2"
              :placeholder="$vuetify.breakpoint.xsOnly ? 'Search...' : 'Search people...'"
            />
            <VMenu
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
              <VList>
                <VListItemGroup v-model="activeSort" color="primary" @change="handleSort('workspace-people')">
                  <VListItem v-for="(item, index) in sortItems" :key="index">
                    <VListItemTitle>{{ item.title }}</VListItemTitle>
                  </VListItem>
                </VListItemGroup>
              </VList>
            </VMenu>
            <VMenu
              v-model="filterMenu"
              offset-y
              nudge-bottom="10"
              :nudge-width="200"
              :nudge-height="300"
              transition="slide-y-transition"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on }">
                <AskAnnaButton class="ml-1" v-on="on" small data-test="workspace-menu-activate-btn">
                  <AskAnnaIcon :color="filterStyle.color">mdi-filter-variant</AskAnnaIcon
                  >{{ $vuetify.breakpoint.xsOnly ? '' : 'Filters' }}
                </AskAnnaButton>
              </template>
              <AskAnnaRow class="pa-2 white">
                <AskAnnaCol class="d-flex pt-1 pb-1" cols="12">
                  <AskAnnaCard flat width="284">
                    <AskAnnaCardSubTitle class="pa-0">
                      <h3>Account types</h3>
                    </AskAnnaCardSubTitle>
                    <AskAnnaSelect
                      v-model="activeRoleFilter"
                      hide-details
                      class="pt-0"
                      no-data-text=""
                      item-text="name"
                      item-value="value"
                      :items="roleFilters"
                    >
                    </AskAnnaSelect>

                    <AskAnnaCardSubTitle class="pa-0 pt-4">
                      <h3>Account status</h3>
                    </AskAnnaCardSubTitle>
                    <AskAnnaSelect
                      v-model="activeStatusFilter"
                      hide-details
                      class="pt-0"
                      no-data-text=""
                      item-text="name"
                      item-value="value"
                      :items="statusFilters"
                    >
                    </AskAnnaSelect>
                  </AskAnnaCard>
                </AskAnnaCol>
              </AskAnnaRow>
            </VMenu>
          </AskAnnaFlex>
        </AskAnnaCol>
      </AskAnnaRow>
    </template>
  </AskAnnaToolbar>
</template>
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  workspaceId: {
    type: String,
    default: ''
  }
})

const {
  search,
  sortStyle,
  sortMenu,
  sortItems,
  activeSort,
  sortrTitle,
  filterMenu,
  filterStyle,
  roleFilters,
  isFilterOpen,
  statusFilters,
  filterMenuStyle,
  activeRoleFilter,
  activeStatusFilter,

  handleSort,
  toggleFilter,
  debounceedSearch
} = useSortFilterPeople('People', 'workspaces')

const permission = usePermission()

const workspacePeopleInviteCreate = computed(() => permission.getFor(permission.labels.workspacePeopleInviteCreate))
</script>
