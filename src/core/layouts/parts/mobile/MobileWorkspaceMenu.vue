<template>
  <div>
    <v-list-group>
      <template v-slot:activator>
        <v-list-item-title @click="handleClickItem">Workspaces</v-list-item-title>
      </template>
      <template v-slot:appendIcon>
        <v-icon @click="handleClickItem">mdi-chevron-down</v-icon>
      </template>

      <v-col cols="12" class="pa-0">
        <v-text-field
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
            :key="item.short_uuid"
            :to="{
              name: 'workspace',
              params: {
                workspaceId: item.short_uuid
              }
            }"
            color="primary"
            @click="handleClickOnMenuItem"
          >
            <v-list-item-icon class="mr-2">
              <v-icon v-text="getIcon(item)"></v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              {{ item.name }}
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-flex v-if="search && !workspaces.length && !isSearchProcessing" class="px-2 pt-2 pl-4 text--secondary"
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
import { useWorkspacesStore } from '@/features/workspaces/useWorkspacesStore'

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
