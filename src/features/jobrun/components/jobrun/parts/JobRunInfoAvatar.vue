<template>
  <div class="d-flex align-baseline">
    <div class="text-body-1">{{ text }}:</div>
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
<script>
import { ref, defineComponent } from '@vue/composition-api'

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
          short_uuid: '',
          job_title: '',
          role: {
            name: '',
            code: ''
          }
        }
      }
    }
  },

  components: {
    WorkspacePeoplePopup
  },

  setup() {
    const workspaceStore = useWorkspaceStore()

    const peoplePopup = ref(false)

    const handleValue = value => (peoplePopup.value = value)
    const handleOpenPeoplePopUp = () => (peoplePopup.value = true)

    return {
      peoplePopup,
      handleValue,
      handleOpenPeoplePopUp,
      workspace: workspaceStore.workspace,
      currentUser: workspaceStore.currentPeople
    }
  }
})
</script>
