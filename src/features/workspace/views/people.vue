<template>
  <div>
    <workspace-people-navbar />
    <workspace-people-list
      :loading="loading"
      :items="workspacePeople"
      :settings="workspaceSettings"
      :workspaceUuid="workspace.uuid"
      :workspaceName="workspace.title"
      @onSelectPoeple="handleSelectPeople"
    />
    <workspace-people-popup
      v-if="peoplePopup"
      :value="peoplePopup"
      :people="selectedPeople"
      :workspaceName="workspace.title"
      @handleValue="handleValue"
      @handleChangeRole="handleChangeRole"
      @onRemovePeople="handleOpenRemovePeople"
      @onDeleteInivitationPopup="handleDeleteInivitationPopup(true)"
      @onResendInivitationPopup="handleResendInivitationPopup(true)"
    />
    <workspace-people-confirm-delete-popup
      v-if="peopleConfirmDeletePopup"
      :value="peopleConfirmDeletePopup"
      :peopleName="selectedPeople.name"
      @onDeleteConfirm="handleDeleteItem"
      @onCloseDeletePopup="handleCloseConfirmDeletePopup"
    />
    <workspace-people-confirm-delete-invitation-popup
      v-if="deleteInvitationConfirmPopup"
      :peopleName="selectedPeople.name"
      :value="deleteInvitationConfirmPopup"
      @onDeleteConfirm="handleDeleteInvitation"
      @onClose="handleDeleteInivitationPopup(false)"
    />
    <workspace-people-confirm-resend-invitation-popup
      v-if="resendInvitationConfirmPopup"
      :peopleName="selectedPeople.name"
      :value="resendInvitationConfirmPopup"
      @onResendConfirm="handleResendItem"
      @onClose="handleResendInivitationPopup(false)"
    />
  </div>
</template>
<script>
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { ref, computed, onBeforeMount, defineComponent, reactive } from '@vue/composition-api'
import WorkspacePeopleList from '@/features/workspace/components/people/WorkspacePeopleList.vue'
import WorkspacePeoplePopup from '@/features/workspace/components/people/WorkspacePeoplePopup.vue'
import WorkspacePeopleNavbar from '@/features/workspace/components/people/WorkspacePeopleNavbar.vue'
import WorkspacePeopleConfirmDeletePopup from '@/features/workspace/components/people/WorkspacePeopleConfirmDeletePopup.vue'
import WorkspacePeopleConfirmDeleteInvitationPopup from '@/features/workspace/components/people/WorkspacePeopleConfirmDeleteInvitationPopup.vue'
import WorkspacePeopleConfirmResendInvitationPopup from '@/features/workspace/components/people/WorkspacePeopleConfirmResendInvitationPopup.vue'

export default defineComponent({
  name: 'workspace',

  components: {
    WorkspacePeopleList,
    WorkspacePeoplePopup,
    WorkspacePeopleNavbar,
    WorkspacePeopleConfirmDeletePopup,
    WorkspacePeopleConfirmResendInvitationPopup,
    WorkspacePeopleConfirmDeleteInvitationPopup
  },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()
    const { workspaceId } = context.root.$route.params

    onBeforeMount(async () => await workspaceStore.getInitialWorkpacePeople({ workspaceId }))
    const peoplePopup = ref(false)
    const selectedPeople = ref(null)
    const peopleConfirmDeletePopup = ref(false)
    const deleteInvitationConfirmPopup = ref(false)
    const resendInvitationConfirmPopup = ref(false)

    const workspacePeople = computed(() => {
      const {
        filter: { role, status },
        search,
        sorting: { sortBy, sort }
      } = workspaceStore.workspacePeopleParams.value

      let people = [...workspaceStore.workspacePeople.value]

      if (!people.length) return people

      if (role) {
        people = people.filter(item => item.role === role)
      }

      if (status) {
        people = people.filter(item => item.status === status)
      }

      if (sortBy && sort) {
        people = people.sort((a, b) => {
          const nameA = (a.name && a.name.toUpperCase()) || ''
          const nameB = (b.name && b.name.toUpperCase()) || ''

          if (nameA < nameB) return -sort
          if (nameA > nameB) return sort

          return 0
        })
      }

      return people
    })

    const handleValue = value => (peoplePopup.value = value)

    const handleOpenRemovePeople = value => (peopleConfirmDeletePopup.value = true)
    const handleChangeRole = value => true

    const handleSelectPeople = people => {
      selectedPeople.value = people
      peoplePopup.value = true
    }

    const handleDeleteItem = () => {
      workspaceStore.deleteWorkspacePeople(selectedPeople.value)
      peopleConfirmDeletePopup.value = false
      peoplePopup.value = false
      deleteInvitationConfirmPopup.value = false
    }

    const handleDeleteInvitation = async () => {
      await workspaceStore.deleteInvitation(selectedPeople.value)

      peopleConfirmDeletePopup.value = false
      peoplePopup.value = false
      deleteInvitationConfirmPopup.value = false
    }

    const handleCloseConfirmDeletePopup = value => (peopleConfirmDeletePopup.value = false)
    const handleDeleteInivitationPopup = value => (deleteInvitationConfirmPopup.value = value)
    const handleResendInivitationPopup = value => (resendInvitationConfirmPopup.value = value)

    const handleResendItem = () => {
      workspaceStore.resendInvitation({
        peopleId: selectedPeople.value.short_uuid,
        workspaceId: selectedPeople.value.workspace.short_uuid
      })
      resendInvitationConfirmPopup.value = false
      peoplePopup.value = false
    }

    return {
      peoplePopup,
      handleValue,
      selectedPeople,
      workspacePeople,
      handleDeleteItem,
      handleResendItem,
      handleChangeRole,
      handleSelectPeople,
      handleDeleteInvitation,
      handleOpenRemovePeople,
      peopleConfirmDeletePopup,
      peopleConfirmDeletePopup,
      resendInvitationConfirmPopup,
      deleteInvitationConfirmPopup,
      handleDeleteInivitationPopup,
      handleCloseConfirmDeletePopup,
      handleResendInivitationPopup,
      workspace: workspaceStore.workspace,
      loading: workspaceStore.workspacePeopleLoading,
      workspaceSettings: workspaceStore.workspaceSettings
    }
  }
})
</script>
