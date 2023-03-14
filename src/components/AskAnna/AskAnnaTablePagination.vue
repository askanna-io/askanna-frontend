<template>
  <div class="ask-anna-pagination v-data-footer">
    <div class="v-data-footer__select">
      Rows per page:
      <AskAnnaSelect
        flat
        hidden
        hide-details
        :value="itemsPerPage"
        @input="updateValue"
        :items="[10, 25, 50, 100]"
      />
    </div>
    <div class="v-data-footer__pagination">{{ pageInfo }}</div>
    <div class="v-data-footer__icons-before">
      <AskAnnaButton
        icon
        :disabled="!previous || loading"
        @click.stop="handleUpdatePage(false)"
      >
        <AskAnnaIcon>mdi-chevron-left</AskAnnaIcon>
      </AskAnnaButton>
    </div>
    <div class="v-data-footer__icons-after">
      <AskAnnaButton
        icon
        :disabled="!next || loading"
        @click.stop="handleUpdatePage(true)"
      >
        <AskAnnaIcon>mdi-chevron-right</AskAnnaIcon>
      </AskAnnaButton>
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
<style>.v-application--is-ltr .ask-anna-pagination .v-data-footer__select .v-select {
  margin: 13px 0 13px 8px;
}</style>
