<template>
  <VDataTable
    fixed-header
    :headers="headers"
    item-key="suuid"
    disable-pagination
    hide-default-footer
    :mobile-breakpoint="0"
    :options.sync="options"
    :page.sync="options.page"
    :loading="sortFilterLoading"
    :server-items-length="count"
    class="variables-table ask-anna-table"
    :items-per-page="options.itemsPerPage"
    :items="variablesStore.variables.results"
    :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100] }"
  >
    <template v-slot:top>
      <slot name="header" />
    </template>

    <template v-slot:item.suuid="{ item }">
      <AskAnnaCopy :text="item.suuid" prefix="#" :show="4" />
    </template>
    <template v-slot:item.name="{ item }">
      <AskAnnaCopy :text="item.name" smartSlice :width="35" />
    </template>
    <template v-slot:item.value="{ item }">
      <AskAnnaCopy :text="item.value" smartSlice :width="35" :masked="item.is_masked" expanded />
    </template>
    <template v-slot:item.actions="{ item }">
      <AskAnnaButton
        v-if="variableEdit"
        class="my-2 btn--hover"
        small
        outlined
        color="secondary"
        @click="handleEditItem(item)"
      >
        <AskAnnaIcon color="secondary" left small class="mr-2">mdi-pencil</AskAnnaIcon>Edit
      </AskAnnaButton>
    </template>
    <template v-slot:no-data>
      <template v-if="variableEdit">
        There are no variables available for this project. In case you need a variable, you can easily create one with
        the option "+ new variable" above this table.
      </template>
      <template v-else> There are no variables available for this project. </template>
    </template>
    <template v-slot:footer>
      <AskAnnaTablePagination
        v-if="variablesStore.variables.results.length"
        :next="next"
        :count="count"
        :previous="previous"
        :page="options.page"
        :itemsPerPage="options.itemsPerPage"
        :pageItemsCount="variablesStore.variables.results.length"
        :loading="variablesStore.variablesLoading || sortFilterLoading"
        @onUpdateOptions="handleUpdateOptions"
      />
    </template>
  </VDataTable>
</template>

<script setup lang="ts">
const emits = defineEmits('onEditItem')

const permission = usePermission()
const { route } = useRouterAskAnna()
const variablesStore = useVariablesStore()

const queryParams = computed(() => route.query)
const projectId = computed(() => route.params.projectId)
const next = computed(() => variablesStore.variables.next)
const count = computed(() => variablesStore.variables.count)
const previous = computed(() => variablesStore.variables.previous)

const { options, sortFilterLoading, handleUpdateOptions } = useQuery({
  next,
  previous,
  queryParams,
  loading: false,
  suuid: projectId,
  page_size: +queryParams.value?.page_size || 25,
  defaultOptions: { page: 1, itemsPerPage: +queryParams.value?.page_size || 25 },
  storeAction: variablesStore.getVariables
})

const variableEdit = computed(() => permission.getFor(permission.labels.variableEdit))

const headers = ref([
  {
    text: 'SUUID',
    align: 'start',
    sortable: false,
    value: 'suuid',
    width: '10%',
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  { text: 'Name', value: 'name', width: '35%', class: 'text-left text-subtitle-2 font-weight-bold h-20 text-no-wrap' },
  {
    text: 'Value',
    value: 'value',
    width: '45%',
    sortable: false,
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  },
  {
    text: '',
    value: 'actions',
    width: '10%',
    sortable: false,
    class: 'text-left text-subtitle-2 font-weight-bold h-20'
  }
])

const handleEditItem = item => emits('onEditItem', item.suuid)
</script>
