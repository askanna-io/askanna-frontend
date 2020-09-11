<template>
  <div>
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
              :key="item.name + item.short_uuid"
              cols="12"
              sm="4"
              md="3"
              lg="3"
              xl="2"
            >
              <v-hover v-slot:default="{ hover }" open-delay="200">
                <workspace-people-card-item
                  :people="item"
                  :workspaceName="workspaceName"
                  :hover="hover"
                  :description="sanitizeHTML(item.description)"
                />
              </v-hover>
            </v-col>
          </v-row>
        </ask-anna-loading-progress>
      </template>
    </v-data-iterator>
    <workspace-people-popup
      v-if="popupValue"
      :value="popupValue"
      :people="selectedPeople"
      :workspaceName="workspaceName"
      @handleValue="handleValue"
      @handleRemove="handleRemove"
      @handleChangeRole="handleChangeRole"
    />
  </div>
</template>
<script>
import { ref, defineComponent } from '@vue/composition-api'
import WorkspacePeoplePopup from './WorkspacePeoplePopup.vue'
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
    }
  },

  components: { WorkspacePeoplePopup, WorkspacePeopleToolbar, WorkspacePeopleCardItem },

  setup() {
    const popupValue = ref(false)
    const selectedPeople = ref(null)
    const sanitizeHTML = useSanitizeHTML()

    const handleValue = value => (popupValue.value = value)

    const handleRemove = value => true
    const handleChangeRole = value => true

    const handleSelectPeople = people => {
      selectedPeople.value = people
      popupValue.value = true
    }

    return { sanitizeHTML, popupValue, selectedPeople, handleValue, handleRemove, handleChangeRole, handleSelectPeople }
  }
})
</script>
