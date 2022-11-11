<template>
  <div>
    <v-list-group>
      <template v-slot:activator>
        <v-list-item-title @click="handleClickItem">Workspaces</v-list-item-title>
      </template>
      <template v-slot:appendIcon>
        <AskAnnaIcon @click="handleClickItem">mdi-chevron-down</AskAnnaIcon>
      </template>

      <AskAnnaCol cols="12" class="pa-0">
        <AskAnnaTextField
          v-if="!loading && (workspaces.length > 0 || search)"
          class="mx-1 mt-2"
          v-model="search"
          @input="handleOnSearch()"
          x-small
          dense
          outlined
          clearable
          single-line
          hide-details
          label="Search workspaces..."
        />

        <v-skeleton-loader v-if="loading" class="mx-auto mt-3" type="heading, text@9"></v-skeleton-loader>

        <v-list flat nav dense class="pt-0">
          <v-list-item
            v-for="item in workspaces.slice(0, 5)"
            :key="item.suuid"
            :to="{
              name: 'workspace',
              params: {
                workspaceId: item.suuid
              }
            }"
            color="primary"
            @click="handleClickOnMenuItem"
          >
            <v-list-item-icon class="mr-2">
              <AskAnnaIcon>{{ getIcon(item) }}</AskAnnaIcon>
            </v-list-item-icon>

            <v-list-item-content>
              {{ item.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <AskAnnaFlex v-if="search && !workspaces.length && !isSearchProcessing" class="px-2 pt-2 pl-4 text--secondary"
          >No results</AskAnnaFlex
        >
        <AskAnnaCol class="pa-2">
          <AskAnnaButton
            v-for="projectBtnOpt of explorBtnOpts"
            @click="handleClickOnMenuItem"
            block
            text
            plain
            small
            outlined
            class="mb-3"
            :key="projectBtnOpt.title"
            :to="projectBtnOpt.to"
            >{{ projectBtnOpt.title }}</AskAnnaButton
          ></AskAnnaCol
        >
      </AskAnnaCol>
    </v-list-group>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits('onClose')

const workspacesStore = useWorkspacesStore()

const explorBtnOpts = [
  { id: 0, to: { name: 'workspaces', query: { is_member: true } }, title: 'All my workspaces' },
  {
    id: 1,
    to: { name: 'workspaces' },
    title: 'All workspaces'
  }
]

const search = ref('')

const isSearchProcessing = ref(false)

const loading = computed(() => workspacesStore.loadingAll)
const allWorkspacesState = computed(() => workspacesStore.allWorkspaces.results)

const workspaces = computed(() => {
  let results = allWorkspacesState.value.filter(item => item.is_member)

  if (search.value) {
    results = results.filter(item => item.name.toLowerCase().includes(search.value.toLowerCase()))
    isSearchProcessing.value = false
  }

  return results
})

const handleClickOnMenuItem = () => {
  search.value = ''
  emits('onClose')
}

const getIcon = workspace => (workspace.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')
const handleOnSearch = () => (isSearchProcessing.value = true)

const handleClickItem = () => {
  search.value = ''
}
</script>
