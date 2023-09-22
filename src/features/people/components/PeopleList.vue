<template>
  <AskAnnaLoadingProgress :loading="loading">
    <AskAnnaInfiniteScroll @load="onLoadMore">
      <template v-slot:empty>
        <div class="h-2 w-2"></div>
      </template>
      <div class="pb-3 px-3 -mt-0 sm:-mt-3">
        <PeopleListToolbar />
      </div>

      <ul
        role="list"
        :class="{ 'px-2': $vuetify.display.xs }"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 list list-none px-3"
      >
        <li
          v-for="item in people"
          :key="item.suuid"
          @click="handleSelectPeople(item)"
        >
          <VHover
            v-slot:default="{ props, isHovering }"
            open-delay="150"
            close-delay="150"
          >
            <PeopleListItem
              v-bind="props"
              :people="item"
              :hover="isHovering"
              :workspaceName="workspaceName"
            />
          </VHover>
        </li>
      </ul>

      <AskAnnaAlert
        v-if="!loading && !people.length"
        class="mx-3"
      >
        <template v-if="queryParams.search">There are no people for this search request.</template>
        <template v-else-if="queryParams.visibility || queryParams.is_member">There are no people for this filter
          request.</template>
        <template v-else-if="!isMember && !peopleStore.loading">You are not allowed to see the peope list of this
          workspace. I can bring you back to the
          workspace
          <RouterLink :to="{ name: 'workspace' }">{{ workspace.name }}</RouterLink>..
        </template>
      </AskAnnaAlert>
    </AskAnnaInfiniteScroll>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
defineProps({
  workspaceName: {
    type: String,
    default: ''
  },
  settings: {
    type: Object,
    default: function () {
      return {
        projectView: 1
      }
    }
  },
  currentUser: {
    type: Object,
    default: function () {
      return {
        email: '',
        name: '',
        role: ''
      }
    }
  }
})

const emits = defineEmits('onSelectPoeple')

const display = useDisplay()
const peopleStore = usePeopleStore()
const { route } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const next = computed(() => peopleStore.people.next)
const loading = computed(() => peopleStore.loading)
const people = computed(() => peopleStore.people.results)
const workspaceId = computed(() => route.params.workspaceId)

const { onLoadMore } = useQuery({
  next,
  queryParams,
  page_size: 28,
  loading: false,
  immediate: true,
  suuid: workspaceId,
  storeAction: peopleStore.getPeople
})

const handleSelectPeople = people => emits('onSelectPoeple', people)
</script>