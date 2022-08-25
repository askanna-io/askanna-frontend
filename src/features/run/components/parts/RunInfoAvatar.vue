<template>
  <div class="d-flex align-baseline">
    <div v-if="text" class="text-body-1">
      <span class="font-weight-bold">{{ text }}:&nbsp;</span>
    </div>
    <span @click="handleOpenPeoplePopUp" class="primary--text ask-anna-link"> {{ value.name }}</span>

    <people-popup
      simple
      :people="value"
      :value="peoplePopup"
      :currentUser="currentUser"
      :workspaceName="workspace.name"
      @handleValue="handleValue"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from '@vue/composition-api'
import { usePeopleStore } from '@/features/people/usePeopleStore'
import PeoplePopup from '@/features/people/components/PeoplePopup.vue'
import { useWorkspaceStore } from '@/features/workspace/useWorkspaceStore'

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

const peopleStore = usePeopleStore()
const workspaceStore = useWorkspaceStore()

const peoplePopup = ref(false)

const workspace = computed(() => workspaceStore.workspace)
const currentUser = computed(() => peopleStore.currentPeople)

const handleValue = value => (peoplePopup.value = value)
const handleOpenPeoplePopUp = () => (peoplePopup.value = true)
</script>
