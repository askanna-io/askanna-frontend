<template>
  <v-data-iterator :items="items" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:header>
      <workspace-toolbar :title="workspaceName" />
    </template>
    <template v-slot:default="props">
      <ask-anna-loading-progress :type="'table-row'" :loading="loading">
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
      </ask-anna-loading-progress>
    </template>
  </v-data-iterator>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import WorkspaceProjectCardItem from './WorkspaceProjectCardItem.vue'
import WorkspaceProjectListItem from './WorkspaceProjectListItem.vue'
import WorkspaceToolbar from '../../components/workspace/WorkspaceToolbar.vue'

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
    loading: {
      type: Boolean,
      default: true
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

  components: { WorkspaceToolbar, WorkspaceProjectCardItem, WorkspaceProjectListItem },

  setup() {
    const sanitizeHTML = useSanitizeHTML()

    return { sanitizeHTML }
  }
})
</script>
