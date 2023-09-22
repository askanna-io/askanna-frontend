import { get, debounce } from 'lodash'

export default function ({
  next,
  suuid,
  loading,
  suuidKey,
  previous,
  page_size,
  storeAction,
  queryParams = {},
  immediate = false,
  asSubChild = false,
  setPageSizeInRoute = true,
  defaultOptions = { page: 1, itemsPerPage: 10, isGoForward: true }
}: any) {
  const { route, replace, routerPush } = useRouterAskAnna()

  const search = ref('')
  const currentCursor = ref('')
  const currentScrollTop = ref(0)
  const options = ref(defaultOptions)
  const sortFilterLoading = ref(false)

  if (queryParams.value?.cursor) {
    const { cursor, ...query } = toValue(queryParams.value)

    replace({ query })
  }

  const handleSearch = (value) => {
    search.value = value
    routerPush({
      name: route.name,
      query: { ...route.query, search: search.value }
    })
  }
  const debounceedSearch = debounce(handleSearch, 350)

  const onScroll = (scrollTop: number) => {
    if (scrollTop > currentScrollTop.value && next.value && next.value.includes('http')) {
      const url = new URL(next.value)
      const cursor = url.searchParams.get('cursor')

      if (cursor === currentCursor.value) return

      currentCursor.value = cursor
      currentScrollTop.value = scrollTop

      storeAction({
        loading,
        suuid: suuid?.value,
        suuidKey: suuidKey,
        params: { page_size, ...queryParams.value, cursor }
      })
    }
  }

  const onLoadMore = async ({ done }) => {
    if (next.value && next.value.includes('http')) {
      const url = new URL(next.value)
      const cursor = url.searchParams.get('cursor')

      if (cursor === currentCursor.value) return

      currentCursor.value = cursor

      await storeAction({
        loading,
        suuid: suuid?.value,
        params: { page_size, ...queryParams.value, cursor }
      })
      done('ok')
    } else {
      done('empty')
    }
  }

  const resetParams = () => {
    currentCursor.value = ''
    currentScrollTop.value = 0
  }

  const handleUpdateOptions = (newValues) => {
    if (sortFilterLoading.value) return
    sortFilterLoading.value = true


    options.value = { ...options.value, ...newValues }
  }

  watch(options, async (options) => {
    const { itemsPerPage: page_size = 10, page = 1, sortBy } = options

    let cursor = undefined
    if (page !== 1 && (next.value?.includes('http') || previous.value?.includes('http'))) {
      const nextPageUrl = options.isGoForward ? next.value : previous.value

      try {
        const url = new URL(nextPageUrl || '')
        cursor = url.searchParams.get('cursor')
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get cursor in useQuery watch.\nError: ', error)
      }
    }

    let order_by = get(sortBy, '[0].key', '')
    const sort_desc = get(sortBy, '[0].order', '')

    order_by = order_by && sort_desc === 'asc' ? order_by : order_by ? `-${order_by}` : undefined

    if (asSubChild) {
      sortFilterLoading.value = true

      await storeAction({
        loading,
        initial: true,
        suuid: suuid?.value,
        suuidKey: suuidKey,
        params: { cursor, order_by, page_size }
      })

      sortFilterLoading.value = false

      return
    }

    routerPush({
      name: route.name,
      params: route.params,
      query: { ...route.query, order_by, cursor, page_size: setPageSizeInRoute ? page_size : undefined }
    })
  })

  watch(
    queryParams,
    async (queryParams) => {
      sortFilterLoading.value = true
      resetParams()

      try {
        await storeAction({
          loading,
          initial: true,
          suuid: suuid?.value,
          suuidKey: suuidKey,
          params: { page_size, ...queryParams }
        })
        sortFilterLoading.value = false
      } catch { }
    },
    { immediate: immediate, deep: true }
  )

  return { options, resetParams, handleUpdateOptions, sortFilterLoading, onScroll, onLoadMore, debounceedSearch }
}
