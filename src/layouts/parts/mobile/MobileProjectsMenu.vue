<template>
  <div>
    <v-list-group>
      <template v-slot:activator @click="handleClickItem">
        <v-list-item-title>Projects</v-list-item-title>
      </template>
      <template v-slot:appendIcon>
        <AskAnnaIcon @click="handleClickItem">mdi-chevron-down</AskAnnaIcon>
      </template>
      <AskAnnaCol cols="12" class="pa-0">
        <AskAnnaTextField
          v-if="!loading && (projects.length > 0 || search)"
          class="mx-1 mt-2"
          v-model="search"
          @input="handleOnSearch()"
          x-small
          dense
          outlined
          clearable
          single-line
          hide-details
          label="Search projects..."
        />

        <v-skeleton-loader v-if="loading" class="mx-auto mt-3" type="heading, text@9"></v-skeleton-loader>

        <v-list flat nav dense class="pt-0">
          <v-list-item
            v-for="item in projects.slice(0, 5)"
            :key="item.suuid"
            :to="{
              name: 'workspace-project',
              params: {
                projectId: item.suuid,
                packageId: item.package.suuid,
                workspaceId: item.workspace.suuid
              }
            }"
            color="primary"
            @click="handleClickOnMenuItem"
          >
            <v-list-item-icon class="mr-2">
              <AskAnnaIcon>mdi-semantic-web</AskAnnaIcon>
            </v-list-item-icon>

            <v-list-item-content>
              {{ item.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <AskAnnaFlex v-if="search && !projects.length && !isSearchProcessing" class="px-2 pt-2 pl-4 text--secondary"
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

const projectsStore = useProjectsStore()

const explorBtnOpts = [
  { id: 0, to: { name: 'projects', query: { is_member: true } }, title: 'All my projects' },
  { id: 1, to: { name: 'projects' }, title: 'Explore all projects' }
]

const search = ref('')
const isSearchProcessing = ref(false)

const loading = computed(() => projectsStore.loading)
const projectsState = computed(() => projectsStore.projects.results)

const projects = computed(() => {
  let results = projectsState.value.filter(item => item.is_member)

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

const handleClickItem = item => {
  search.value = ''
}

const handleOnSearch = () => (isSearchProcessing.value = true)
</script>
