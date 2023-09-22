<template>
  <VDataTableServer
    :color="'primary'"
    :headers="headers"
    :items-length="count"
    :mobile-breakpoint="0"
    :options.sync="options"
    :page.sync="options.page"
    :items="variablesStore.variables.results"
    class="askanna-table scrollbar min-w-full"
    :loading.sync="sortFilterLoading && 'primary'"
    v-model:items-per-page="options.itemsPerPage"
    @update:options="loadItems"
  >
    <template v-slot:top>
      <slot name="header" />
    </template>

    <template v-slot:item="{ item }">
      <tr class="pointer askanna-table--row hover:bg-third">
        <AskAnnaTableItem>
          <AskAnnaTableItemTextWithCopy
            prefix="#"
            suffix=""
            :maxLength="4"
            :value="item.raw.suuid"
            copyTitle="Copy variable SUUID"
          />
        </AskAnnaTableItem>
        <AskAnnaTableItem>
          <AskAnnaTableItemTextWithCopy
            :maxLength="maxLength"
            :value="item.raw.name"
            copyTitle="Copy variable name"
          />
        </AskAnnaTableItem>
        <AskAnnaTableItem>
          <AskAnnaCopy
            expanded
            smartSlice
            :width="35"
            :text="item.raw.value"
            :masked="item.raw.is_masked"
            copyTitle="Copy variable value"
          />
        </AskAnnaTableItem>
        <AskAnnaTableItem>
          <AskAnnaButton
            v-if="variableEdit"
            class="my-2"
            prependIcon="mdi-pencil"
            @click="handleEditItem(item.raw)"
          >
            Edit
          </AskAnnaButton>
        </AskAnnaTableItem>
      </tr>
    </template>

    <template v-slot:no-data>
      <div class="text-left">
        There are no variables available for this project. Project variables are applied to every run environment when
        you trigger a run. You can use variables for settings, passwords, tokens, etcetera. Masked variables can be used
        for sensitive information.
        <a
          target="_blank"
          class="askanna-link"
          href="https://docs.askanna.io/variable/"
        >Read the documentation</a>
        for more information about how you can use variables in the job definition and project code.
      </div>
    </template>
    <template v-slot:bottom>
      <AskAnnaTablePagination
        v-if="variablesStore.variables.results.length"
        :next="next"
        :count="count"
        title="variables"
        :autoPerPage="true"
        :previous="previous"
        :page="options.page"
        :itemsPerPage="options.itemsPerPage"
        :pageItemsCount="variablesStore.variables.results.length"
        :loading="variablesStore.variablesLoading || sortFilterLoading"
        @onUpdateOptions="handleUpdateOptions"
      />
    </template>
  </VDataTableServer>
</template>

<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const emits = defineEmits('onEditItem')

const display = useDisplay()
const { route } = useRouterAskAnna()
const permission = useAskAnnaPermission()
const variablesStore = useVariablesStore()
const { width, height } = useAskAnnaWindowSize()

const queryParams = computed(() => route.query)
const projectId = computed(() => route.params.projectId)
const next = computed(() => variablesStore.variables.next)
const count = computed(() => variablesStore.variables.count)
const previous = computed(() => variablesStore.variables.previous)

const maxLength = computed(() => {
  switch (toValue(display.name)) {
    case 'xs':
      return (width.value * 0.4) / 8
    case 'sm':
      return (width.value * 0.3) / 7
    default:
      return 1000
  }
})

const tableItemHeight = ref(52)
const tableitemsPerPage = computed(() => {
  let h = height.value - 270
  return Math.floor(h / tableItemHeight.value) + 3
})

const { options, sortFilterLoading, handleUpdateOptions } = useQuery({
  next,
  previous,
  queryParams,
  loading: false,
  immediate: true,
  suuid: projectId,
  setPageSizeInRoute: false,
  page_size: tableitemsPerPage.value,
  storeAction: variablesStore.getVariables,
  defaultOptions: { page: 1, itemsPerPage: tableitemsPerPage.value }
})

const loadItems = ({ page, itemsPerPage, sortBy }) => {
  handleUpdateOptions({ page, itemsPerPage, sortBy })
}

const variableEdit = computed(() => permission.getFor(permission.labels.variableEdit))

const headers = ref([
  {
    title: 'SUUID',
    align: 'start',
    sortable: false,
    key: 'suuid',
    width: '10%'
  },
  { title: 'Name', key: 'name', width: '35%' },
  {
    title: 'Value',
    key: 'value',
    width: '45%',
    sortable: false
  },
  {
    title: '',
    key: 'actions',
    width: '10%',
    sortable: false
  }
])

const handleEditItem = item => emits('onEditItem', item.suuid)

const adjustTableHeight = () => {
  setTimeout(() => {
    const [rowEle] = document.getElementsByClassName('askanna-table--row')
    tableItemHeight.value = rowEle?.clientHeight > 52 ? rowEle?.clientHeight : 52
  }, 500)
}

adjustTableHeight()
</script>
