<template>
  <v-data-iterator :items="items" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:header>
      <workspace-people-toolbar :title="workspaceName" />
    </template>
    <template v-slot:default="props">
      <ask-anna-loading-progress :type="'table-row'" :loading="loading">
        <v-row v-if="!settings.projectView">
          <v-col
            v-for="item in props.items"
            @click="handleSelectPeople(item)"
            :key="item.name + item.short_uuid + item.role"
            cols="12"
            sm="4"
            md="3"
            lg="3"
            xl="3"
          >
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <workspace-people-card-item
                :people="item"
                :hover="hover"
                :workspaceName="workspaceName"
                :statusColor="getStatus(item.status)"
                :description="sanitizeHTML(item.description)"
              />
            </v-hover>
          </v-col>
        </v-row>
      </ask-anna-loading-progress>
    </template>
  </v-data-iterator>
</template>
<script>
import { ref, defineComponent } from '@vue/composition-api'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import WorkspacePeopleToolbar from './WorkspacePeopleToolbar.vue'
import WorkspacePeopleCardItem from './WorkspacePeopleCardItem.vue'

export default defineComponent({
  name: 'WorkspacePeopleList',

  props: {
    workspaceName: {
      type: String,
      default: ''
    },
    workspaceUuid: {
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
    },
    currentUser: {
      type: Object,
      default: function () {
        return {
          email: '',
          name: '',
          role: ''
        }
      }
    }
  },

  components: {
    WorkspacePeopleToolbar,
    WorkspacePeopleCardItem
  },

  setup(props, context) {
    const sanitizeHTML = useSanitizeHTML()

    const getStatus = status => status === 'invited' && 'blue lighten-3'

    const handleSelectPeople = people => context.emit('onSelectPoeple', people)

    return {
      getStatus,
      sanitizeHTML,
      handleSelectPeople
    }
  }
})
</script>

<style scoped>
.is-current-user {
  border: 1px solid var(--v-primary-base);
}
</style>
