<template>
  <AskAnnaToolbar
    density="compact"
    extension-height="50"
    :extended="$vuetify.display.xs && isFilterOpen"
    class="rounded [&>div:nth-child(2)]:px-2 [&>div]:pr-1"
    :class="{ 'pb-2': $vuetify.display.xs && isFilterOpen }"
  >
    <div class="flex w-full items-center mt-2 sm:mt-0 justify-between ">
      <div class="sm:w-9/12 md:w-6/12 xl:w-4/12">
        <AskAnnaToolbarTitle class="pl-4">
          People</AskAnnaToolbarTitle>
      </div>

      <div class="w-8/12 sm:w-9/12 md:w-6/12 xl:w-4/12">
        <AskAnnaTextField
          v-if="isFilterOpen && !$vuetify.display.xs"
          clearable
          hide-details
          v-model="search"
          class="clearable"
          @input="debounceedSearch"
          @click:clear="handleSearch"
          :placeholder="$vuetify.display.xs ? 'Search...' : 'Search people...'"
        />
      </div>
      <div class="flex items-center justify-end sm:w-9/12 md:w-6/12 xl:w-4/12 text-end">
        <template v-if="workspacePeopleInviteCreate">
          <AskAnnaSpacer />
          <PeoplePopupInviteUser />
        </template>

        <AskAnnaButton
          size="default"
          variant="text"
          @click="toggleFilter"
          :icon="filterMenuStyle.icon"
          :color="filterMenuStyle.color"
          :colorIcon="filterMenuStyle.color"
        />
      </div>
    </div>

    <template
      v-if="isFilterOpen"
      v-slot:extension
    >
      <div class="flex items-center w-full justify-center">
        <AskAnnaTextField
          v-if="isFilterOpen && $vuetify.display.xs"
          clearable
          hide-details
          v-model="search"
          class="mr-2 clearable"
          @input="debounceedSearch"
          @click:clear="handleSearch"
          :placeholder="$vuetify.display.xs ? 'Search...' : 'Search people...'"
        />
        <VMenu
          v-model="sortMenu"
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ props }">
            <AskAnnaButtonActivator
              v-bind="props"
              nameIcon="mdi-sort"
              :colorIcon="sortStyle.color"
            >
              {{ $vuetify.display.xs ? '' : sortrTitle }}
            </AskAnnaButtonActivator>
          </template>
          <VList
            color="primary"
            class="p-0 mt-2"
            v-model="activeSort"
            select-strategy="classic"
            @click:select="handleSort('workspace-people', $event.id)"
          >
            <VListItem
              v-for="(item, i) in sortItems"
              :key="i"
              :value="i"
              :title="item.title"
              class="rounded-none"
              :active="activeSort === i"
            />
          </VList>
        </VMenu>
        <VMenu
          v-model="filterMenu"
          transition="slide-y-transition"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ props }">
            <AskAnnaButtonActivator
              class="ml-1"
              v-bind="props"
              nameIcon="mdi-filter-variant"
              :colorIcon="filterStyle.color"
            >
              {{ $vuetify.display.xs ? ''
                : 'Filters' }}
            </AskAnnaButtonActivator>
          </template>
          <AskAnnaCard class="p-2 mt-2 w-72">
            <AskAnnaCardSubTitle>
              Account types
            </AskAnnaCardSubTitle>
            <AskAnnaSelect
              v-model="activeRoleFilter"
              :items="roleFilters"
            />
            <AskAnnaCardSubTitle class="pt-4">
              Account status
            </AskAnnaCardSubTitle>
            <AskAnnaSelect
              :items="statusFilters"
              v-model="activeStatusFilter"
            />
          </AskAnnaCard>
        </VMenu>
      </div>
    </template>
  </AskAnnaToolbar>
</template>
<script setup lang="ts">
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
  handleSearch,
  debounceedSearch
} = useSortFilterPeople('People', 'workspaces')

const permission = useAskAnnaPermission()

const workspacePeopleInviteCreate = computed(() => permission.getFor(permission.labels.workspacePeopleInviteCreate))
</script>