<template>
  <VDataIterator :items="items" hide-default-footer :no-data-text="''" disable-pagination>
    <template v-slot:header>
      <PeopleToolbar :title="workspaceName" />
    </template>
    <template v-slot:default="props">
      <AskAnnaLoadingProgress :loading="loading">
        <AskAnnaRow v-if="!settings.projectView" :class="{ 'px-2': $vuetify.breakpoint.xsOnly }">
          <AskAnnaCol
            v-for="item in props.items"
            @click="handleSelectPeople(item)"
            :key="item.name + item.suuid + item.role"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="3"
            :class="{ 'pb-0': $vuetify.breakpoint.xsOnly }"
          >
            <VHover v-slot:default="{ hover }" open-delay="200">
              <PeopleCardItem
                :people="item"
                :hover="hover"
                :workspaceName="workspaceName"
                :statusColor="getStatus(item.status)"
                :description="sanitizeHTML(item.description)"
              />
            </VHover>
          </AskAnnaCol>
        </AskAnnaRow>
      </AskAnnaLoadingProgress>
    </template>
  </VDataIterator>
</template>
<script setup lang="ts">
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
