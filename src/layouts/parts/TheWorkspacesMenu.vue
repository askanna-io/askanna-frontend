<template>
  <VMenu
    :close-on-content-click="false"
    v-model="workspacesStore.menu.isOpen"
  >
    <template v-slot:activator="{ props }">
      <AskAnnaButton
        color="white"
        variant="text"
        v-bind="props"
        @click="handleOpenMenu"
      >Workspaces</AskAnnaButton>
    </template>

    <AskAnnaCard class="flex gap-2 w-full mt-2">
      <VList
        mandatory
        class="w-48 pt-3"
        density="compact"
        v-model="listMenu"
        @click:select="$event => handleChangeMenu($event)"
      >
        <VListItem
          v-for="(item, i) in menuItems"
          :key="i"
          :value="i"
          :active="listMenu === i"
        >
          <VListItemTitle
            v-text="item.text"
            class="font-medium"
          />
        </VListItem>
      </VList>
      <div
        :style="{ 'border-left': 'solid' }"
        class="border-l-3 border-primary rounded-l-sm my-3 pl-2 w-64 pb-1"
      >
        <template v-if="listMenu === 2">
          <WorkspaceCreateForm
            class="pt-1"
            @onClose="handleCloseMenu"
          />
        </template>
        <template v-else>
          <AskAnnaTextField
            v-if="workspacesStore.menu.isShowSearch || workspacesStore.menu.query.search"
            clearable
            single-line
            hide-details
            persistent-clear
            class="clearable"
            @input="debounceedSearch"
            @click:clear="handleSearch"
            label="Search workspaces..."
            v-model="workspacesStore.menu.query.search"
          />

          <template v-if="loading">
            <div class="pt-2">
              <div
                v-for="i in pageSize"
                :key="i"
                class="h-4 bg-third rounded-full max-w-[360px] mb-2.5"
              ></div>
            </div>
          </template>

          <template v-else>
            <ul
              role="list"
              class="relative z-0 divide-y divide-secondary list-none "
            >
              <li
                v-for="item in workspaces"
                :key="item.suuid"
                class="cursor-pointer"
              >
                <div class="relative flex items-center space-x-3 px-2 py-1 hover:bg-third">
                  <div class="flex-shrink-0">
                    <AskAnnaIcon
                      color="on-surface"
                      :icon="getIcon(item)"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <RouterLink
                      :to="{
                        name: 'workspace',
                        params: {
                          workspaceId: item.suuid
                        }
                      }"
                      class="focus:outline-none no-underline text-secondary"
                    >
                      <span
                        aria-hidden="true"
                        class="absolute inset-0"
                      ></span>
                      <p class="truncate">{{ item.name }}</p>
                    </RouterLink>
                  </div>
                </div>
              </li>
            </ul>
          </template>

          <div
            v-if="workspacesStore.menu.query.search && !workspaces.length && !loading"
            class="flex px-2 pt-2"
          >
            No results
          </div>
          <AskAnnaButton
            :active="false"
            class="mt-4 mb-0"
            @click="handleCloseMenu"
            :to="workspaceBtnOpt.to"
          >
            {{ workspaceBtnOpt.title }}
          </AskAnnaButton>
        </template>
      </div>
    </AskAnnaCard>
  </VMenu>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'

const { height } = useWindowSize()
const workspacesStore = useWorkspacesStore()

const explorBtnOpts = [
  {
    id: 0,
    title: 'All my workspaces',
    query: { is_member: true },
    to: { name: 'workspaces', query: { is_member: true } }
  },
  {
    id: 1,
    to: { name: 'workspaces' },
    title: 'Explore all workspaces',
    query: { order_by: '-is_member', visibility: 'public' }
  }
]

const pageSize = ref(9)
const listMenu = ref(0)
const menuItems = ref([
  { text: 'My workspaces', icon: 'fas fa-project-diagram' },
  { text: 'Explore workspaces', icon: '' },
  { text: 'Create workspace', icon: '' }
])

watch(height, (val) => {
  pageSize.value = val < 471 ?
    Math.round((val - 170) / 34) : 9
}, { immediate: true })

const loading = computed(() => workspacesStore.menu.loading)
const workspaces = computed(() => workspacesStore.menu.workspaces.results)
const workspaceBtnOpt = computed(() => explorBtnOpts.find(el => el.id === listMenu.value))

const getIcon = workspace => (workspace.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')

const handleChangeMenu = async (event) => {
  listMenu.value = event.id
  workspacesStore.menu.query.search = null
  await workspacesStore.getMenuWorkspaces({ params: { ...workspaceBtnOpt.value?.query, page_size: pageSize.value }, loading: true })
}

const handleCloseMenu = () => {
  listMenu.value = 0
  workspacesStore.menu.isOpen = false
  workspacesStore.menu.query.search = null
}

const handleSearch = async () => {
  await workspacesStore.getMenuWorkspaces({
    loading: true,
    params: { search: workspacesStore.menu.query.search, ...workspaceBtnOpt.value.query, page_size: pageSize.value }
  })
}

const debounceedSearch = debounce(handleSearch, 350)

const handleOpenMenu = async () => {
  if (workspacesStore.menu.workspaces.results.length) return

  await workspacesStore.getMenuWorkspaces({ params: { ...workspaceBtnOpt.value.query, page_size: pageSize.value }, loading: true })
}
</script>