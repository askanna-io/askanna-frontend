import { capitalize, debounce } from 'lodash'

export default function sortFilter(sortItem: string, sortItemPlural: string) {
  const { route, replace } = useRouterAskAnna()

  const ISMEMBER = {
    '': '',
    true: true,
    false: false
  }
  const VISIBILITIES = {
    all: '',
    public: 'PUBLIC',
    private: 'PRIVATE'
  }

  const query = computed(() => route.query)

  const { order_by = '', search: searchText } = query.value

  const sortItems = [
    { title: 'Created (New to Old)', value: { order_by: '-created_at' } },
    { title: 'Created (Old to New)', value: { order_by: 'created_at' } },

    { title: `${sortItem} name (A to Z)`, value: { order_by: 'name' } },
    { title: `${sortItem} name (Z to A)`, value: { order_by: '-name' } }
  ]

  const state = reactive({
    sortMenu: false,
    filterMenu: false,
    search: searchText,
    isFilterOpen: false,
    activeSort: sortItems.findIndex(item => item.value.order_by === order_by)
  })

  if (query.value.search) state.isFilterOpen = true

  const sortrTitle = computed(() => (state.activeSort >= 0 ? sortItems[state.activeSort].title : 'Sort'))

  const visibilityFilters = [
    { value: '', name: `All ${sortItemPlural}` },
    { value: 'PUBLIC', name: `Public ${sortItemPlural}` },
    { value: 'PRIVATE', name: `Private ${sortItemPlural}` }
  ]

  const isMemberFilters = [
    { value: '', name: `All ${sortItemPlural}` },
    { value: true, name: `${capitalize(sortItemPlural)} I'm a member of` },
    { value: false, name: `${capitalize(sortItemPlural)} I'm not a member of` }
  ]

  const activeMemberFilter = computed({
    get: () => {
      const { is_member = '' } = query.value

      return isMemberFilters.find(item => item.value === ISMEMBER[is_member])
    },
    set: async is_member => {
      handleChangeQuery({ ...query.value, is_member })
    }
  })

  const activeRoleFilter = computed({
    get: () => {
      const { visibility = 'all' } = query.value

      return visibilityFilters.find(item => item.value === VISIBILITIES[visibility])
    },
    set: async visibility => {
      handleChangeQuery({ ...query.value, visibility })
    }
  })

  const sortStyle = computed(() => ({
    color: state.activeSort >= 0 ? 'primary' : 'secondary'
  }))

  const filterMenuStyle = computed(() => {
    return {
      color: state.isFilterOpen ? 'primary' : 'secondary',
      icon: Object.entries(query.value).filter(([key, value]) => key !== 'order_by' && value).length ? 'mdi-filter' : 'mdi-filter-outline'
    }
  })

  const filterStyle = computed(() => ({
    color: activeRoleFilter.value?.value || activeMemberFilter.value?.value ? 'primary' : 'secondary'
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

  const handleSort = (route: string, id: number) => {
    state.activeSort = id === state.activeSort ? -1 : id
    const sortIndex = state.activeSort === -1 ? 0 : state.activeSort

    const params = typeof state.activeSort !== 'undefined' && sortItems[sortIndex].value
    const routeName = route === 'workspace' ? undefined : route
    handleChangeQuery({ ...query.value, ...params, routeName })
  }

  const handleChangeQuery = ({ order_by = 'created_at', is_member, search, visibility, routeName }) => {
    // we don't show the default value of sorting and filtering in URL params
    const query = {
      search: search || undefined,
      order_by: order_by === '-created_at' ? undefined : order_by,
      visibility: !visibility ? undefined : visibility.toLowerCase(),
      is_member: typeof is_member === 'undefined' || is_member === '' ? undefined : is_member
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
    filterStyle,
    filterMenuStyle,
    isMemberFilters,
    activeRoleFilter,
    visibilityFilters,
    activeMemberFilter,

    handleSort,
    toggleFilter,
    handleSearch,
    debounceedSearch
  }
}
