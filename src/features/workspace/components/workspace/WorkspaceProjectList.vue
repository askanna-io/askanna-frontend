<template>
  <v-skeleton-loader ref="skeleton" :type="'table-row'" :loading="loading">
    <v-data-iterator :items="items" hide-default-footer>
      <template v-slot:header>
        <workspace-toolbar :title="workspaceName" />
      </template>
      <template v-slot:default="props">
        <v-skeleton-loader ref="skeleton" :loading="loading" :transition="'scale-transition'" :type="'table-row'">
          <v-row v-if="!settings.projectView">
            <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="6" lg="4">
              <v-hover v-slot:default="{ hover }" open-delay="200">
                <workspace-project-card-item :project="item" :workspaceName="workspaceName" :hover="hover" />
              </v-hover>
            </v-col>
          </v-row>
          <div v-if="settings.projectView">
            <div v-for="item in props.items" :key="item.name">
              <workspace-project-list-item :project="item" :workspaceName="workspaceName" cols="12" />
              <v-divider />
            </div>
          </div>
        </v-skeleton-loader>
      </template>
    </v-data-iterator>
  </v-skeleton-loader>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
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

  components: { WorkspaceToolbar, WorkspaceProjectCardItem, WorkspaceProjectListItem }
})
</script>
