<template>
  <v-data-iterator :items="items" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:default="props">
      <v-row v-if="!settings.projectView" :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
        <v-col
          v-for="item in props.items"
          :key="item.name + item.short_uuid"
          cols="12"
          sm="6"
          md="4"
          lg="4"
          :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
        >
          <v-hover v-slot:default="{ hover }" open-delay="200">
            <workspace-project-card-item
              :project="item"
              :workspaceName="workspaceName"
              :hover="hover"
              :description="sanitizeHTML(item.description)"
            />
          </v-hover>
        </v-col>
      </v-row>
      <div v-if="settings.projectView">
        <div v-for="item in props.items" :key="item.name + item.short_uuid">
          <workspace-project-list-item :project="item" :workspaceName="workspaceName" cols="12" />
          <v-divider />
        </div>
      </div>
    </template>
    <template v-slot:no-data
      ><v-alert v-if="!loading" class="mt-2 text-center" dense outlined>
        <template v-if="isWorkspaceViewer || !isSignIn">
          There are no projects in this workspace that you have access to.
        </template>
        <template v-else>
          There are no projects in this workspace. So, let's create one. You can easily do this with the option "+
          CREATE PROJECT" in the grey bar.<br />
          <router-link
            :to="{
              name: 'workspace-new-project',
              params: { workspaceId: $route.params.workspaceId }
            }"
          >
            Or click here to create a new project.</router-link
          >
        </template>
      </v-alert></template
    >
  </v-data-iterator>
</template>
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import WorkspaceProjectCardItem from './WorkspaceProjectCardItem.vue'
import WorkspaceProjectListItem from './WorkspaceProjectListItem.vue'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

defineProps({
  workspaceName: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  settings: {
    type: Object,
    default: function () {
      return {
        projectView: 1
      }
    }
  }
})

const permission = usePermission()
const sanitizeHTML = useSanitizeHTML()
const workspaceStore = useWorkspaceStore()

const isSignIn = computed(() => permission.token)
const loading = computed(() => workspaceStore.loading.value.projects)
const isWorkspaceViewer = computed(() => workspaceStore.currentPeople.value.role.code === 'WV')
</script>
