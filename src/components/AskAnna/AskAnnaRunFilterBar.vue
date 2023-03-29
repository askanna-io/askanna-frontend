<template>
    <div
        role="dialog"
        ref="filterBar"
        aria-modal="true"
        :class="{ 'ring-primary': isOpen, 'ring-gray-200 ': !isOpen }"
        class="select-text relative z-10 transform divide-gray-100 rounded-sm bg-white ring-1 transition-all py-1 mt-2 sm:py-0 sm:mt-0"
    >
        <div class="flex">
            <div class="flex items-center flex-initial">
                <AskAnnaIcon
                    class="pl-1 text-gray-400"
                    :class="{ 'text-secondary': isOpen }"
                >mdi-magnify</AskAnnaIcon>
            </div>
            <ul class="flex list-none align-center gap-1 pl-0 flex-wrap">
                <li
                    v-for="(item, index) in selectedFilters"
                    class="flex-none"
                >
                    <span
                        class="inline-flex items-center rounded-sm text-gray-800 bg-gray-100 py-0.5 pl-2.5 pr-1 text-sm font-medium"
                    >
                        <span>{{ item.filter?.title }}</span>
                        <span class="pl-1">{{ item.operator?.title }}</span>
                        <span class="pl-1">{{ item.option?.title }}</span>
                        <button
                            @click="handleDeleteItem(index)"
                            v-if="item.option.value"
                            type="button"
                            class="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full hover:bg-indigo-200 focus:text-white focus:outline-none"
                        >
                            <svg
                                class="h-2 w-2"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 8 8"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-width="1.5"
                                    d="M1 1l6 6m0-6L1 7"
                                />
                            </svg>
                        </button>
                    </span>
                </li>
                <li
                    v-if="filtersBarStore.activeFilter.filter.value"
                    class="flex-none"
                >
                    <span
                        class="inline-flex items-center rounded-sm text-gray-800 bg-gray-100 py-0.5 pl-2.5 pr-1 text-sm font-medium"
                    >
                        {{ filtersBarStore.activeFilter.filter.title }} {{ filtersBarStore.activeFilter.operator.title
                        }}
                        {{
                            filtersBarStore.activeFilter.option.title }}
                    </span>
                </li>
                <li class="grow">
                    <div class="relative">
                        <input
                            :value="search"
                            type="text"
                            role="combobox"
                            autocomplete="off"
                            aria-expanded="false"
                            aria-controls="filters"
                            :placeholder="placeholder"
                            ref="searchFilterInputRef"
                            @click="handleClick"
                            @input="handleOnInput"
                            @keydown.esc="handleEsc"
                            @keydown.down="highlightNext"
                            @keydown.backspace="handleBackspace"
                            @keydown.tab.prevent="highlightNext"
                            @keydown.up.prevent="highlightPrevious"
                            @keydown.enter.prevent="handleSelectByEnter"
                            class="h-8 pl-0 py-0 w-full flex border-0 bg-transparent  text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                        >
                        <ul
                            v-if="isOpen"
                            class="absolute list-none z-10 mt-1 pl-0 max-h-60 overflow-auto rounded-sm bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            tabindex="1"
                            id="options"
                            role="listbox"
                            aria-labelledby="listbox-label"
                            aria-activedescendant="listbox-option-3"
                        >
                            <template v-if="filtersBarStore.currentFilterItems.isFetching">
                                <li
                                    class="cursor-default select-none text-gray-800 bg-gray-100 hover:bg-gray-200 focus:outline-none flex items-center px-4 py-2 leading-6 text-sm  transition ease-in-out duration-150 ">
                                    <svg
                                        class="animate-spin -ml-1 mr-3 h-5 w-5 "
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            class="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            stroke-width="4"
                                        />
                                        <path
                                            class="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>..loading
                                </li>
                            </template>
                            <template v-for="(item, index) in filtersBarStore.filterItems">
                                <li
                                    class="cursor-default select-none   hover:bg-gray-200 focus:outline-none"
                                    :id="`option-${index + 1}`"
                                    role="option"
                                    tabindex="-1"
                                    :class="{ 'bg-gray-300': isActiveIndex(index) }"
                                >
                                    <button
                                        type="button"
                                        @click="handleSelect(item)"
                                        class="w-full  py-2 text-left"
                                    ><span class="px-4">{{ item.title }}</span></button>
                                </li>
                            </template>
                        </ul>
                    </div>
                </li>
            </ul>
            <div class="flex items-center flex-initial mr-1 z-10 ">
                <button
                    v-if="selectedFilters.length || search"
                    @click="handleClearAll"
                    class="rounded-full text-gray-800  p-1 text-sm font-medium hover:text-primary hover:bg-gray-100"
                >
                    <AskAnnaIcon
                        class="text-gray-400"
                        :class="{ 'text-secondary hover:text-primary ': isOpen }"
                    >mdi-close</AskAnnaIcon>
                </button>
            </div>
        </div>
        <p
            v-if="false"
            class="p-4 text-sm text-gray-500"
        >No people found.</p>
    </div>
</template>
<script setup lang="ts">
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import AskAnnaIcon from './AskAnnaIcon.vue'
import { until, watchArray, onClickOutside } from '@vueuse/core'

interface Params {
    [key: string]: string
}

const fetchValues = useFetch()
const permission = usePermission()
const peopleStore = usePeopleStore()
const context = getCurrentInstance()
const filtersBarStore = useFiltersBarStore()
const { route, routerPush } = useRouterAskAnna()

const filterBar = ref()
const searchFilterInputRef = ref()

const { isOpen, search, selectedFilters } = storeToRefs(filtersBarStore)

const isPermissionSet = computed(() => peopleStore.isPermissionSet)
const isMobile = computed(() => context?.proxy.$root.$vuetify.breakpoint.xsOnly)
const projectJobList = computed(() => permission.getFor(permission.labels.projectJobList))
const workspacePeopleList = computed(() => permission.getFor(permission.labels.workspacePeopleList))

const filters = computed(() => [
    {
        value: 'created_by_suuid',
        title: 'Created by',
        show: workspacePeopleList.value,
        operators: [{ title: 'is', value: '=' }, { title: 'is not', value: 'exclude' }],
        options: fetchValues({ pointModule: 'workspace', pointName: 'getPeople', suuid: route.params.workspaceId })
    },
    {
        value: 'job_suuid',
        title: 'Job name',
        show: projectJobList.value,
        operators: [{ title: 'is', value: '=' }, { title: 'is not', value: 'exclude' }],
        options: fetchValues({ pointModule: 'job', pointName: 'list', params: { project_suuid: route.params.projectId } })
    },
    {
        value: 'status',
        title: 'Status',
        show: true,
        operators: [{ title: 'is', value: '=' }, { title: 'is not', value: 'exclude' }],
        options: { isFinished: true, data: [{ title: 'queued', value: 'queued' }, { title: 'running', value: 'running' }, { title: 'finished', value: 'finished' }, { title: 'failed', value: 'failed' }] }
    },
    {
        value: 'trigger',
        title: 'Trigger',
        show: true,
        operators: [{ title: 'is', value: '=' }, { title: 'is not', value: 'exclude' }],
        options: { isFinished: true, data: [{ title: 'api', value: 'api' }, { title: 'cli', value: 'cli' }, { title: 'python-sdk', value: 'python-sdk' }, { title: 'webui', value: 'webui' }, { title: 'worker', value: 'worker' }] }
    }
].filter(item => item.show))

const isMacOS = computed(() => window.navigator.userAgent.indexOf("Mac OS X") !== -1)

const placeholder = computed(() => {
    if (isOpen.value || search.value || filtersBarStore.selectedFilters.length) return ''
    if (isMobile.value) return 'Search and filter'

    return isMacOS.value ?
        'Search and filter runs for this project - Press ⌘ + K to focus'
        : 'Search and filter runs for this project - Press Ctrl + K to focus'

})


watchArray(filtersBarStore.selectedFilters, (newList) => {
    if (!filtersBarStore.isInit) return

    const list = newList.reduce((acc, cr) => {
        const operator = cr.operator.value !== '=' ? '__' + cr.operator.value : ''
        const filter = cr.filter.value + operator
        if (acc.hasOwnProperty(filter)) {
            acc[filter] = acc[filter] + ',' + cr.option.value
        } else {
            acc[filter] = cr.option.value
        }

        return acc
    }, {} as Params)

    const { search, page_size, order_by } = route.query

    routerPush({
        name: route.name || 'workspace-project-runs',
        query: { search, order_by, page_size, ...list }
    })
}, { deep: true })

onMounted(() => {
    window.addEventListener('keydown', event => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            isOpen.value = true
            nextTick(() => {
                searchFilterInputRef.value?.focus()
                filtersBarStore.highlightedIndex = 0
            })

            event.preventDefault()
        }
    })
})

onUnmounted(() => {
    filtersBarStore.$reset()
})

const init = async () => {
    await until(isPermissionSet).toBe(true)
    filtersBarStore.init(filters.value, route.query)
}

init()

onClickOutside(filterBar, () => {
    filtersBarStore.handleClickOutside()
    if (search.value) {
        hadnleSetSearchParam(search.value)
    }
}
)

const handleSelectByEnter = async () => {
    if (search.value && filtersBarStore.highlightedIndex === -1) {
        hadnleSetSearchParam(search.value)

        return
    }

    clearSearchParams()

    await filtersBarStore.handleSelectByEnter()
}

const handleSelect = async (item) => {
    await filtersBarStore.handleSelect(item)

    clearSearchParams()
    searchFilterInputRef.value.focus()
}

const clearSearchParams = () => {
    if (search.value || route.query.search) {
        hadnleSetSearchParam()
    }
}

const handleClearAll = async () => {
    search.value = ''
    hadnleSetSearchParam()

    if (filtersBarStore.activeFilter.options.canAbort) {
        await filtersBarStore.activeFilter.options.abort()
    }

    filtersBarStore.resetFilters()
    searchFilterInputRef.value.focus()
}

const handleEsc = () => {
    isOpen.value = false
    filtersBarStore.highlightedIndex = 0
    hadnleSetSearchParam(search.value)
}

const hadnleSetSearchParam = (search = undefined) => {
    const params = search ? { ...route.query, search: search } : { ...route.query, search }
    routerPush({
        name: route.name || 'workspace-project-runs',
        query: params
    })
}

const debounceedSearch = debounce(hadnleSetSearchParam, 550)

const handleClick = () => {
    if (filtersBarStore.activeFilter.filter.value && isOpen.value) {
        filtersBarStore.resetActiveFilter()
    }

    if (isMobile.value) {
        if (isOpen.value) {
            filtersBarStore.highlightedIndex = -1
        }
        isOpen.value = !isOpen.value

        return
    }

    if (!isOpen.value) {
        isOpen.value = true
        filtersBarStore.highlightedIndex = 0
    }
}

const handleDeleteItem = (index: number) => {
    filtersBarStore.handleDeleteItem(index)
}

const handleOnInput = (event) => {
    filtersBarStore.highlightedIndex = isMobile.value ? filtersBarStore.highlightedIndex : 0
    const currentSearchLength = search.value?.length
    search.value = event?.target?.value

    if (search.value.length < currentSearchLength
        || !search.value && route.query.search
        || search.value && !filtersBarStore.activeFilter.filter.value && !filtersBarStore.filterItems.length
    ) {
        debounceedSearch(search.value)
    }
}

const handleBackspace = () => {
    filtersBarStore.handleBackspace()
}

const highlightNext = () => {
    if (!filtersBarStore.isOpen) {
        filtersBarStore.isOpen = true
        return
    }

    filtersBarStore.highlightNext()
}

const highlightPrevious = () => {
    filtersBarStore.highlightPrevious()
}

const isActiveIndex = (index) => index === filtersBarStore.highlightedIndex
</script>
