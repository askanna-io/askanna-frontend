<template>
  <v-data-iterator :items="items" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:header>
      <people-toolbar :title="workspaceName" />
    </template>
    <template v-slot:default="props">
      <ask-anna-loading-progress :type="'table-row'" :loading="loading">
        <v-row v-if="!settings.projectView" :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
          <v-col
            v-for="item in props.items"
            @click="handleSelectPeople(item)"
            :key="item.name + item.short_uuid + item.role"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="3"
            :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
          >
            <v-hover v-slot:default="{ hover }" open-delay="200">
              <people-card-item
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
<script setup lang="ts">
import PeopleToolbar from './PeopleToolbar.vue'
import PeopleCardItem from './PeopleCardItem.vue'
import useSanitizeHTML from '@/core/composition/useSanitizeHTML'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

defineProps({
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
})

const emits = defineEmits('onSelectPoeple')

const sanitizeHTML = useSanitizeHTML()

const getStatus = status => status === 'invited' && 'blue lighten-3'

const handleSelectPeople = people => emits('onSelectPoeple', people)
</script>

<style scoped>
.is-current-user {
  border: 1px solid var(--v-primary-base);
}
</style>
