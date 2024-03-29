<template>
  <AskAnnaToolbar
    extension-height="50"
    :extended="$vuetify.display.xs && isFilterOpen"
    class="rounded [&>div:nth-child(2)]:px-2 [&>div]:pr-1"
    :class="{ 'pb-2': $vuetify.display.xs && isFilterOpen }"
  >
    <div class="flex w-full items-center mt-2 sm:mt-0 justify-between">
      <div
        class="w-9/12"
        :class="{
          'sm:w-4/12': isFilterOpen && isSignIn,
          'md:w-4/12': isFilterOpen && !isSignIn,
          'md:w-8/12 xl:w-9/12': !isFilterOpen && isSignIn,
          'md:w-11/12 xl:w-11/12': !isFilterOpen && !isSignIn
        }"
      >
        <AskAnnaListTitle
          v-if="isSignIn"
          class="whitespace-pre-wrap truncate"
        >{{ title }}</AskAnnaListTitle>
        <AskAnnaListTitle v-else-if="isWorkspacePublic">{{ title }}</AskAnnaListTitle>
        <AskAnnaListTitle v-else>Not allowed</AskAnnaListTitle>
      </div>

      <div class="w-8/12 sm:w-9/12 md:w-4/12 xl:w-4/12">
        <AskAnnaTextField
          v-if="isFilterOpen && !$vuetify.display.xs"
          clearable
          hide-details
          v-model="search"
          class="clearable"
          @input="debounceedSearch"
          @click:clear="handleSearch"
          :placeholder="$vuetify.display.xs ? 'Search...' : 'Search projects...'"
        />
      </div>
      <div class="flex items-center justify-end sm:w-9/12 md:w-4/12 xl:w-4/12 text-end">
        <ProjectPopupCreate v-if="!$vuetify.display.xs" />

        <AskAnnaButtonIconSquare
          @click="showInfo = !showInfo"
          :icon="showInfo ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        />

        <AskAnnaButtonIconSquare
          @click="toggleFilter"
          iconSize="small"
          class="p-1"
          :icon="filterMenuStyle.icon"
          :color="filterMenuStyle.color"
          :colorIcon="filterMenuStyle.color"
        />

        <WorkspaceToolbarMenu
          :isMember="isMember"
          :workspaceUuid="workspaceUuid"
          @onOpenWorkspaceRemove="handleOpenConfirmRemoveWorkspace"
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
          :placeholder="$vuetify.display.xs ? 'Search...' : 'Search projects...'"
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
            @click:select="handleSort('workspace', $event.id)"
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
          v-if="isSignIn"
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
              {{ $vuetify.display.xs ? '' : filterTitle }}
            </AskAnnaButtonActivator>
          </template>
          <AskAnnaCard class="p-2 mt-2 w-72">
            <AskAnnaCardSubTitle>
              Project visibility
            </AskAnnaCardSubTitle>
            <AskAnnaSelect
              v-model="activeRoleFilter"
              :items="visibilityFilters"
            />
          </AskAnnaCard>
        </VMenu>
      </div>
    </template>
  </AskAnnaToolbar>
  <VExpandTransition>
    <div v-show="showInfo">
      <div class="flex flex-col md:flex-row items-start px-4 whitespace-nowrap">
        <div class="md:basis-2/3 lg:basis-1/3">
          <RunInfoCopyText
            class="h-8"
            title="SUUID"
            copyTitle:="Copy SUUID"
            :value="workspaceUuid"
          />
        </div>
        <div class="md:basis-2/3 lg:basis-1/3 pr-5">
          <RunInfoText
            class="h-8"
            text="Created at"
            :value="dayjs(createdAt).format('Do MMMM YYYY, h:mm:ss a')"
          />
        </div>
        <div class="basis-1/3 ">
          <RunInfoAvatar
            class="h-8"
            text="Created by"
            :value="createdBy"
          />
        </div>
      </div>
      <template v-if="description !== '<p></p>'">
        <RunInfoText
          text="Description"
          class="ml-4 h-8"
        />
        <AskAnnaDescription
          class="ml-2 sm:ml-0"
          readonly
          :description="description"
        />
      </template>
    </div>
  </VExpandTransition>
</template>
<script setup lang="ts">
import { CreatedBy } from '@/features/run/types'

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
  description: {
    type: String,
    default: ''
  },
  workspaceUuid: {
    type: String,
    default: ''
  },
  createdBy: {
    type: Object as () => CreatedBy,
    default: () => ({})
  },
  createdAt: {
    type: String,
    default: ''
  },
})
const emit = defineEmits('onOpenWorkspaceRemove')

const { dayjs } = useDayjs()
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
  handleSearch,
  toggleFilter,
  debounceedSearch
} = useSortFilter('Project', 'projects')

const permission = useAskAnnaPermission()

const showInfo = ref(false)

const isSignIn = computed(() => permission.token.value)

const handleOpenConfirmRemoveWorkspace = () => emit('onOpenWorkspaceRemove')
</script>