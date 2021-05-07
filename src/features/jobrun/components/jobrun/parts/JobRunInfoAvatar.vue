<template>
  <div class="d-flex align-baseline">
    <div class="text-body-1">{{ text }}:</div>
    <v-btn color="primary" @click="handleOpenPeoplePopUp" class="px-1 AskAnna-text--initial text-body-1" text x-small>
      {{ value.name }}</v-btn
    >

    <workspace-people-popup
      :value="peoplePopup"
      :people="people"
      :currentUser="currentUser"
      :workspaceName="workspace.name"
      @handleValue="handleValue"
    />
  </div>
</template>
<script>
import { ref, computed, defineComponent } from '@vue/composition-api'

import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspacePeoplePopup from '@/features/workspace/components/people/WorkspacePeoplePopup.vue'

export default defineComponent({
  name: 'JobRunInfoAvatar',

  props: {
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
          short_uuid: ''
        }
      }
    }
  },

  components: {
    WorkspacePeoplePopup
  },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()

    const peoplePopup = ref(false)
    const people = computed(() => workspaceStore.workspacePeople.value.find(item => item.name === props.value.name))

    const handleValue = value => (peoplePopup.value = value)
    const handleOpenPeoplePopUp = () => (peoplePopup.value = true)

    return {
      people,
      peoplePopup,
      handleValue,
      handleOpenPeoplePopUp,
      workspace: workspaceStore.workspace,
      currentUser: workspaceStore.currentPeople
    }
  }
})
</script>
