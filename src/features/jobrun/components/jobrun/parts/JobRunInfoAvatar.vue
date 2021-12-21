<template>
  <div class="d-flex align-baseline">
    <div class="text-body-1">
      <span class="font-weight-bold">{{ text }}:</span>
    </div>
    <v-btn color="primary" @click="handleOpenPeoplePopUp" class="px-1 AskAnna-text--initial text-body-1" text x-small>
      {{ value.name }}</v-btn
    >

    <workspace-people-popup
      simple
      :value="peoplePopup"
      :people="value"
      :currentUser="currentUser"
      :workspaceName="workspace.name"
      @handleValue="handleValue"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspacePeoplePopup from '@/features/workspace/components/people/WorkspacePeoplePopup.vue'

defineProps({
  text: {
    type: String,
    default: ''
  },
  value: {
    type: Object,
    default: () => {
      return {
        name: '',
        uuid: '',
        short_uuid: '',
        job_title: '',
        role: {
          name: '',
          code: ''
        }
      }
    }
  }
})

const workspaceStore = useWorkspaceStore()

const peoplePopup = ref(false)

const workspace = computed(() => workspaceStore.workspace)

const currentUser = computed(() => workspaceStore.currentPeople)

const handleValue = value => (peoplePopup.value = value)
const handleOpenPeoplePopUp = () => (peoplePopup.value = true)
</script>
