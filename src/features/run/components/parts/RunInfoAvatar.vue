<template>
  <div class="flex align-baseline items-center">
    <div v-if="text">
      <span class="font-bold">{{ text }}:&nbsp;</span>
    </div>
    <span
      @click="handleOpenPeoplePopUp"
      class="text-primary  cursor-pointer"
    > {{ value?.name || value?.suuid }}</span>
    <PeoplePopup
      simple
      :people="value"
      :value="peoplePopup"
      :currentUser="currentUser"
      :workspaceId="workspace.suuid"
      :workspaceName="workspace.name"
      @handleValue="handleValue"
    />
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
