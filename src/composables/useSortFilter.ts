import { capitalize, debounce } from 'lodash'

export default function sortFilter(sortItem: string, sortItemPlural: string) {
  const { route, router } = useRouterAskAnna()

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

  const { sort = '', sortby = '', search: searchText } = query.value

  const sortItems = [
    { title: 'Created (New to Old)', value: { sortby: 'created', sort: 'desc' } },
    { title: 'Created (Old to New)', value: { sortby: 'created', sort: 'asc' } },

    { title: `${sortItem} name (A to Z)`, value: { sortby: 'name', sort: 'asc' } },
    { title: `${sortItem} name (Z to A)`, value: { sortby: 'name', sort: 'desc' } }
  ]

  const state = reactive({
    sortMenu: false,
    filterMenu: false,
    search: searchText,
    isFilterOpen: false,
    activeSort: sortItems.findIndex(item => item.value.sort === sort && item.value.sortby === sortby)
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
      icon: Object.values(query.value).filter(value => value).length ? 'mdi-filter' : 'mdi-filter-outline'
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

  const handleSort = (routeName: string) => {
    const params = typeof state.activeSort !== 'undefined' && sortItems[state.activeSort].value
    handleChangeQuery({ ...query.value, ...params, routeName })
  }

  const handleChangeQuery = ({ sort = 'desc', sortby = 'created', is_member, search, visibility, routeName }) => {
    // we don't show the default value of sorting and filtering in URL params
    const query = {
      search: search || undefined,
      sort: sort === 'desc' ? undefined : sort,
      sortby: sortby === 'created' ? undefined : sortby,
      visibility: !visibility ? undefined : visibility.toLowerCase(),
      is_member: typeof is_member === 'undefined' || is_member === '' ? undefined : is_member
    }

    router.replace({
      name: routeName,
      query
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
    debounceedSearch
  }
}
