<template>
  <div>
    <v-list-group>
      <template v-slot:activator @click="handleClickItem">
        <v-list-item-title>Projects</v-list-item-title>
      </template>
      <template v-slot:appendIcon>
        <v-icon @click="handleClickItem">mdi-chevron-down</v-icon>
      </template>
      <v-col cols="12" class="pa-0">
        <v-text-field
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
            :key="item.short_uuid"
            :to="{
              name: 'workspace-project',
              params: {
                projectId: item.short_uuid,
                packageId: item.package.short_uuid,
                workspaceId: item.workspace.short_uuid
              }
            }"
            color="primary"
            @click="handleClickOnMenuItem"
          >
            <v-list-item-icon class="mr-2">
              <v-icon v-text="'mdi-semantic-web'"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              {{ item.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-flex v-if="search && !projects.length && !isSearchProcessing" class="px-2 pt-2 pl-4 text--secondary"
          >No results</v-flex
        >
        <v-col class="pa-2">
          <v-btn
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
            >{{ projectBtnOpt.title }}</v-btn
          ></v-col
        >
      </v-col>
    </v-list-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import { useProjectsStore } from '@/features/projects/useProjectsStore'

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
