<template>
  <div class="d-flex align-baseline">
    <div v-if="text" class="text-body-1">
      <span class="font-weight-bold">{{ text }}:&nbsp;</span>
    </div>
    <span @click="handleOpenPeoplePopUp" class="primary--text ask-anna-link"> {{ value.name }}</span>
    <PeoplePopup
      simple
      :people="value"
      :value="peoplePopup"
      :currentUser="currentUser"
      :workspaceName="workspace.name"
      @handleValue="handleValue" />
  </div>
</template>
<script setup lang="ts">
import { CreatedBy } from '../../types'

defineProps({
  text: {
    type: String,
    default: ''
  },
  value: {
    type: Object as () => CreatedBy,
    default: () => ({})
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
