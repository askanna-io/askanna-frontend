<template>
  <div class="flex justify-end items-center">
    <template v-if="!autoPerPage">Rows per page:
      <VSelect
        hide-details
        color="primary"
        density="compact"
        item-title="name"
        item-value="value"
        variant="underlined"
        :value="itemsPerPage"
        :items="[10, 25, 50, 100]"
        class="ml-2 w-14 flex-initial page-select"
        @update:modelValue="updateValue"
      />
    </template>
    <div
      v-if="next || previous"
      class="ml-2 sm:ml-4"
    >{{ props.count }} {{ props.title }}</div>
    <div v-if="next || previous">
      <AskAnnaButtonIcon
        variant="text"
        :disabled="!previous || loading"
        @click.stop="handleUpdatePage(false)"
      >
        <AskAnnaIcon icon="mdi-chevron-left" />
      </AskAnnaButtonIcon>
    </div>
    <div
      v-if="next || previous"
      class="v-data-footer__icons-after"
    >
      <AskAnnaButtonIcon
        variant="text"
        :disabled="!next || loading"
        @click.stop="handleUpdatePage(true)"
      >
        <AskAnnaIcon icon="mdi-chevron-right" />
      </AskAnnaButtonIcon>
    </div>
  </div>
</template>

<script ref setup lang="ts">
const emit = defineEmits(['onUpdateOptions'])

const props = defineProps({
  count: {
    default: 0
  },
  next: {
    default: ''
  },
  title: {
    default: 'results'
  },
  loading: {
    default: false
  },
  previous: {
    default: ''
  },
  page: {
    default: 0
  },
  pageItemsCount: {
    default: 0
  },
  itemsPerPage: {
    default: 25
  },
  autoPerPage: {
    default: false
  }
})

const pageInfo = ref('')

const pageStart = computed(() => {
  if (props.loading) return this

  if (props.itemsPerPage === -1 || !props.count) return 0

  return (props.page - 1) * props.itemsPerPage + 1
})

const pageStop = computed(() => {
  if (props.loading) return this
  if (props.itemsPerPage === -1) return props.pageItemsCount
  if (!props.count) return 0

  return Math.min(props.pageItemsCount, props.page * props.itemsPerPage) + pageStart.value - 1
})

const updateValue = value => {
  emit('onUpdateOptions', { itemsPerPage: value, page: 1 })
}

const calcPageInfo = () => `${pageStart.value}-${pageStop.value} of ${props.count}`

const handleUpdatePage = next => {
  const value = next ? props.page + 1 : props.page - 1

  emit('onUpdateOptions', { page: value, isGoForward: next })
}

watch(
  () => props.loading,
  loadingValue => {
    if (loadingValue) return

    pageInfo.value = calcPageInfo()
  }
)
</script>

<style lang="scss">
.page-select.v-input {

  .v-select__selection-text,
  .v-field__input {
    display: flex;
    padding-top: unset !important;
    align-items: center;

    input {
      top: 10px !important;
    }
  }

  .v-field__append-inner {
    padding-top: 10px;
  }
}
</style>