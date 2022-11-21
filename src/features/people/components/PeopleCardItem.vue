<template>
  <AskAnnaCard class="mx-auto h-100 cursor--pointer" :elevation="hover ? 16 : 2">
    <VAppBar height="10" absolute flat dense white--text color="white">
      <AskAnnaSpacer />
      <AskAnnaIcon v-if="statusColor" class="mt-5" :color="statusColor">mdi-email-send-outline</AskAnnaIcon>
    </VAppBar>
    <AskAnnaRow>
      <AskAnnaCol cols="2" class="ml-2">
        <AskAnnaAvatar class="ml-1" size="60" tile>
          <VImg class="img--rounded" :src="people.avatar.small" />
        </AskAnnaAvatar>
      </AskAnnaCol>
      <AskAnnaCol class="ml-3" cols="9" align-self="start">
        <VListItem color="rgba(0, 0, 0, .4)">
          <VListItemContent>
            <VListItemTitle class="people-title">{{ people.name || people.email }}</VListItemTitle>
            <v-list-item-subtitle>{{ people.role.name }}</v-list-item-subtitle>
          </VListItemContent>
        </VListItem>
      </AskAnnaCol>
    </AskAnnaRow>
  </AskAnnaCard>
</template>

<script setup lang="ts">
defineProps({
  people: {
    type: Object,
    default: function () {
      return {
        suuid: '',
        name: '',
        role: '',
        created: '',
        modified: '',
        job_title: '',
        suuid: '',
        last_active: ''
      }
    }
  },
  description: {
    type: String,
    default: () => ''
  },
  workspaceName: {
    type: String,
    default: () => ''
  },
  hover: {
    type: Boolean,
    default: false
  },
  statusColor: {
    type: [String, Boolean],
    default: 'white'
  }
})
</script>
<style scoped>
.h-100 {
  height: 100%;
}
.project--description {
  min-height: 82px;
  max-height: 86px;
  overflow: hidden;
}
.people-title {
  font-weight: 300px;
}
</style>
