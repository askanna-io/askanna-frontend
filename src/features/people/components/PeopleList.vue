<template>
  <VDataIterator
    :items="people"
    hide-default-footer
    :no-data-text="''"
    disable-pagination
    v-scroll="throttle(handleOnScroll, 1000)"
  >
    <template v-slot:header>
      <PeopleToolbar
        :title="workspaceName"
        :workspaceId="workspaceId"
      />
    </template>
    <template v-slot:default="props">
      <AskAnnaRow
        v-if="!settings.projectView"
        :class="{ 'px-2': $vuetify.breakpoint.xsOnly }"
      >
        <AskAnnaCol
          v-for="item in props.items"
          @click="handleSelectPeople(item)"
          :key="item.name + item.suuid + item.role"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="3"
          :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
        >
          <VHover
            v-slot:default="{ hover }"
            open-delay="200"
          >
            <PeopleCardItem
              :people="item"
              :hover="hover"
              :workspaceName="workspaceName"
              :statusColor="getStatus(item.status)"
              :description="sanitizeHTML(item.description)"
            />
          </VHover>
        </AskAnnaCol>
      </AskAnnaRow>
    </template>
    <template v-slot:footer>
      <AskAnnaRow
        class="mt-2"
        align="center"
        justify="center"
      >
        <AskAnnaButton
          v-if="isLargeScreen && people.length && next"
          small
          outlined
          color="secondary"
          :loading="loading"
          :disabled="loading"
          class="ml-3 btn--hover"
          @click="handleLoadMoreProjects"
        >
          <AskAnnaIcon
            left
            color="secondary"
          >mdi-chevron-down</AskAnnaIcon>Show more people
        </AskAnnaButton>
        <AskAnnaSpacer />
      </AskAnnaRow>
    </template>
  </VDataIterator>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

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

const context = getCurrentInstance()
const peopleStore = usePeopleStore()
const { route } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const next = computed(() => peopleStore.people.next)
const loading = computed(() => peopleStore.loading)
const people = computed(() => peopleStore.people.results)
const workspaceId = computed(() => route.params.workspaceId)
const isLargeScreen = computed(() => (
  context?.proxy.$root.$vuetify.breakpoint.height >= 1500
))

const { onLoadMore, onScroll } = useQuery({
  next,
  queryParams,
  page_size: 28,
  loading: false,
  immediate: true,
  suuid: workspaceId,
  storeAction: peopleStore.getPeople
})

const handleLoadMoreProjects = () => onLoadMore()

const handleOnScroll = e => onScroll(e.target.documentElement.scrollTop)

const sanitizeHTML = useSanitizeHTML()

const getStatus = status => status === 'invited' && 'blue lighten-3'

const handleSelectPeople = people => emits('onSelectPoeple', people)
</script>
