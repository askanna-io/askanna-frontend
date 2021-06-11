<template>
  <v-data-iterator :items="items" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:default="props">
      <v-row v-if="!settings.projectView">
        <v-col v-for="item in props.items" :key="item.name + item.short_uuid" cols="12" sm="6" md="6" lg="4">
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
      ><v-alert class="mt-2 text-center" dense outlined color="grey">
        There are no projects in this workspace. So, let's create one. You can easily do this with the option "+ CREATE
        PROJECT" in the grey bar.<br />
        <router-link
          :to="{
            name: 'workspace-new-project',
            params: { workspaceId: $route.params.workspaceId }
          }"
        >
          Or click here to create a new project.</router-link
        >
      </v-alert></template
    >
  </v-data-iterator>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import WorkspaceProjectCardItem from './WorkspaceProjectCardItem.vue'
import WorkspaceProjectListItem from './WorkspaceProjectListItem.vue'

export default defineComponent({
  name: 'WorkspaceList',

  props: {
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
  },

  components: { WorkspaceProjectCardItem, WorkspaceProjectListItem },

  setup() {
    const sanitizeHTML = useSanitizeHTML()

    return { sanitizeHTML }
  }
})
</script>
