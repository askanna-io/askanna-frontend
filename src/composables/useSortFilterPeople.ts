import { debounce } from 'lodash'

export default function sortFilter(sortItem: string, sortItemPlural: string) {
  const { route, replace } = useRouterAskAnna()

  const ROLE_FILTERS = {
    all: '',
    wa: 'WA',
    wm: 'WM',
    wv: 'WV'
  }

  const roleFilters = [
    { value: '', name: 'All types' },
    { value: 'WA', name: 'Workspace admin' },
    { value: 'WM', name: 'Workspace member' },
    { value: 'WV', name: 'Workspace viewer' }
  ]

  const statusFilters = [
    { value: '', name: 'All' },
    { value: 'invited', name: 'Invited' },
    { value: 'active', name: 'Active' }
  ]

  const query = computed(() => route.query)

  const { order_by = '', search: searchText } = query.value

  const sortItems = [
    { title: 'Created (New to Old)', value: { order_by: '-created' } },
    { title: 'Created (Old to New)', value: { order_by: 'created' } },

    { title: `${sortItem} name (A to Z)`, value: { order_by: 'name' } },
    { title: `${sortItem} name (Z to A)`, value: { order_by: '-name' } }
  ]

  const state = reactive({
    sortMenu: false,
    filterMenu: false,
    search: searchText,
    isFilterOpen: false,
    activeSort: sortItems.findIndex((item) => item.value.order_by === order_by)
  })

  if (query.value.search) state.isFilterOpen = true

  const sortrTitle = computed(() => (state.activeSort >= 0 ? sortItems[state.activeSort].title : 'Sort'))

  const activeRoleFilter = computed({
    get: () => {
      const { role_code = 'all' } = query.value

      return roleFilters.find((item) => item.value === ROLE_FILTERS[role_code])
    },
    set: async (role_code) => {
      handleChangeQuery({ ...query.value, role_code })
    }
  })

  const activeStatusFilter = computed({
    get: () => {
      const { status = '' } = query.value

      return statusFilters.find((item) => item.value === status)
    },
    set: async (status) => {
      handleChangeQuery({ ...query.value, status })
    }
  })

  const sortStyle = computed(() => ({
    color: state.activeSort >= 0 ? 'primary' : 'secondary'
  }))

  const filterMenuStyle = computed(() => {
    return {
      color: state.isFilterOpen ? 'primary' : 'secondary',
      icon: Object.values(query.value).filter((value) => value).length ? 'mdi-filter' : 'mdi-filter-outline'
    }
  })

  const filterStyle = computed(() => ({
    color: activeRoleFilter.value?.value || activeStatusFilter.value?.value ? 'primary' : 'secondary'
  }))

  const filterTitle = computed(() => (activeRoleFilter.value?.value ? activeRoleFilter.value?.name : 'Filter'))

  const toggleFilter = () => {
    state.isFilterOpen = !state.isFilterOpen
    if (!state.isFilterOpen) {
      state.sortMenu = false
      state.filterMenu = false
    }
  }

  const handleSearch = () => handleChangeQuery({ ...query.value, search: state.search })
  const debounceedSearch = debounce(handleSearch, 350)

  const handleSort = (routeName: string) => {
    const params = typeof state.activeSort !== 'undefined' && sortItems[state.activeSort].value
    handleChangeQuery({ ...query.value, ...params, routeName })
  }

  const handleChangeQuery = ({ order_by = 'created', status, search, role_code, routeName }) => {
    // we don't show the default value of sorting and filtering in URL params
    const query = {
      search: search || undefined,
      order_by: order_by === '-created' ? undefined : order_by,
      status: typeof status === 'undefined' || status === '' ? undefined : status,
      role_code: typeof role_code === 'undefined' || role_code === '' ? undefined : role_code.toLowerCase()
    }

    replace({
      query,
      name: routeName
    })
  }

  return {
    ...toRefs(state),
    sortItems,
    sortStyle,
    sortrTitle,

    filterTitle,
    roleFilters,
    filterStyle,
    statusFilters,
    filterMenuStyle,
    activeRoleFilter,
    activeStatusFilter,

    handleSort,
    toggleFilter,
    debounceedSearch
  }
}
