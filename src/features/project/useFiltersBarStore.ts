import { defineStore } from 'pinia'

interface FilterDefault {
  filter: {
    title: string
    value: string
  }
  operator: {
    title: string
    value: string
  }
  option: {
    title: string
    value: string
  }
  filters: FilterItem[]
  operators: FilterItem[]
  options: {
    abort: void
    canAbort: boolean
    data: FilterItem[]
    isFinished: boolean
  }
}

interface FilterItem {
  title: string
  value: string
}

const defaultFilter: FilterDefault = {
  filter: {
    title: '',
    value: ''
  },
  operator: {
    title: '',
    value: ''
  },
  option: {
    title: '',
    value: ''
  },
  filters: [] as FilterItem[],
  operators: [] as FilterItem[],
  options: { data: [] as FilterItem[], isFinished: false }
}

export const useFiltersBarStore = defineStore('PROJECT_RUN_FILTER_BAR_STORE', {
  state: () => {
    return {
      search: '',
      isInit: false,
      isOpen: false,
      highlightedIndex: -1,
      filters: [] as FilterItem[],
      activeFilter: { ...defaultFilter },
      selectedFilters: [] as FilterDefault[],
      currentFilterItems: {
        data: [],
        isFinished: false
      }
    }
  },

  getters: {
    filterItems: (state) => state.currentFilterItems?.data?.filter(item => item?.title?.toLocaleLowerCase().includes(state.search?.toLocaleLowerCase() || ''))
  },

  actions: {
    async init(filters, query) {
      this.filters = filters
      this.search = query.search

      this.currentFilterItems = {
        data: filters,
        isFinished: true
      }

      const params = Object.keys(query).map((key) => ({ filter: key, value: query[key] }))

      this.isInit = true

      if (!params.length) return

      await this.setFiltersByParams(params)
      this.isInit = true
    },

    async setFiltersByParams(params) {
      for (const item of params) {
        const [filterValue, operatorValue = '='] = item.filter.split('__')
        const filter = this.filters.find(el => el.value === filterValue)

        if (!filter) continue

        const operator = filter.operators.find(el => el.value === operatorValue)

        for (const optionName of item.value.split(',')) {
          let option
          if (!filter.options.isFinished && !filter.options?.data) {
            await filter.options.execute()
          }

          option = filter.options.data.find(el => el.value === optionName)

          this.selectedFilters.push({ ...filter, filter: { title: filter.title, value: filter.value }, operator, option })
        }
      }
    },

    async handleSelect(item) {
      this.search = ''
      this.highlightedIndex = 0

      if (!this.activeFilter.filter.value) {
        Object.assign(this.activeFilter, { ...item, filter: { title: item.title, value: item.value } })

        if (this.activeFilter.operators.length === 1) {
          const operator = this.activeFilter.operators[0]
          await this.handleSetOperator(operator)

          return
        }
        this.currentFilterItems.data = [...item.operators]
      }
      else if (this.activeFilter.filter.value && !this.activeFilter.operator?.value) {
        await this.handleSetOperator(item)
      } else {
        this.selectedFilters.push({ ...this.activeFilter, option: item })
        this.activeFilter = { ...defaultFilter }
        this.currentFilterItems = { data: this.filters, isFinished: true }
        //this.searchFilterInputRef.value?.focus()
      }
    },

    async handleSetOperator(operator: FilterItem) {
      this.activeFilter.operator = operator
      this.currentFilterItems = this.activeFilter.options

      //get dynamic values 
      if (!this.activeFilter.options.isFinished) {
        await this.activeFilter.options.execute()
      }
    },

    handleSelectByEnter() {
      if (this.currentFilterItems?.isFetching) return

      const item = this.filterItems[this.highlightedIndex]
      if (!item) return

      this.handleSelect(item)
    },

    handleBackspace() {
      if (this.search) return

      this.currentFilterItems = { data: this.filters, isFinished: true }

      if (this.activeFilter.filter.value) {
        this.activeFilter = { ...defaultFilter }

        return
      }

      if (this.selectedFilters.length) {
        this.selectedFilters.pop()
        this.activeFilter = { ...defaultFilter }

        return
      }
    },

    highlightNext() {
      if (this.highlightedIndex < this.filterItems?.length - 1) {
        this.highlightedIndex += 1
      }
    },

    highlightPrevious() {
      if (this.highlightedIndex > 0) {
        this.highlightedIndex -= 1
        return
      }
      this.highlightedIndex = -1
    },

    handleDeleteItem(index: number) {
      this.selectedFilters.splice(index, 1)
      this.activeFilter = { ...defaultFilter }
    },

    resetFilters() {
      this.selectedFilters.splice(0, this.selectedFilters.length)
      this.resetActiveFilter()
    },

    resetActiveFilter() {
      this.activeFilter = { ...defaultFilter }
      this.currentFilterItems = { data: this.filters, isFinished: true }
      this.highlightedIndex = 0
    },

    handleClickOutside() {
      this.isOpen = false
      if (this.activeFilter.filter.value) {
        this.resetActiveFilter()
      }
    }
  }
})
