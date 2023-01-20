import { get } from 'lodash'
import { debounce } from 'lodash'

export default function ({
  next,
  suuid,
  loading,
  previous,
  page_size,
  storeAction,
  queryParams = {},
  immediate = false,
  asSubChild = false,
  defaultOptions = { page: 1, itemsPerPage: 10 }
}: any) {
  const { route, routerPush } = useRouterAskAnna()

  const search = ref('')
  const currentCursor = ref('')
  const currentScrollTop = ref(0)
  const sortFilterLoading = ref(false)
  const options = ref(defaultOptions)

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
        params: { page_size, ...queryParams.value, cursor }
      })
    }
  }

  const resetParams = () => {
    currentCursor.value = ''
    currentScrollTop.value = 0
  }

  watch(options, async (options, previousOptions) => {
    const { page: previousPage = 1 } = previousOptions
    const { itemsPerPage: page_size = 10, page = 1, sortBy, sortDesc } = options

    let cursor = undefined

    if (page !== 1 && page !== previousPage && (next.value?.includes('http') || previous.value?.includes('http'))) {
      const nextPageUrl = page > previousPage ? next.value : previous.value

      try {
        const url = new URL(nextPageUrl || '')
        cursor = url.searchParams.get('cursor')
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get cursor in useQuery watch.\nError: ', error)
      }
    }

    let order_by = get(sortBy, '[0]', '')
    const sort_desc = get(sortDesc, '[0]', '')

    order_by = order_by && sort_desc ? order_by : order_by ? `-${order_by}` : undefined

    if (asSubChild) {
      sortFilterLoading.value = true

      await storeAction({
        loading,
        initial: true,
        suuid: suuid?.value,
        params: { cursor, order_by, page_size }
      })

      sortFilterLoading.value = false

      return
    }

    routerPush({
      name: route.name,
      query: { ...route.query, order_by, cursor, page_size }
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
          params: { page_size, ...queryParams }
        })
        sortFilterLoading.value = false
      } catch {}
    },
    { immediate: immediate }
  )

  return { options, resetParams, sortFilterLoading, onScroll, debounceedSearch }
}
