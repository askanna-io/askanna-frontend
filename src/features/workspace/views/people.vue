<template>
  <div>
    <workspace-people-navbar />
    <workspace-people-list
      :loading="loading"
      :items="workspacePeople"
      :currentUser="currentUser"
      :settings="workspaceSettings"
      :workspaceUuid="workspace.uuid"
      :workspaceName="workspace.title"
      @onSelectPoeple="handleSelectPeople"
    />
    <workspace-people-popup
      v-if="peoplePopup"
      :value="peoplePopup"
      :people="selectedPeople"
      :currentUser="currentUser"
      :workspaceName="workspace.title"
      :roleAction="roleAction"
      :isPeopleAdmin="isPeopleAdmin"
      @handleValue="handleValue"
      @onChangeRole="handleChangeRole"
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

    <workspace-people-confirm-change-role-popup
      v-if="changeRoleConfirmPopup"
      :roleAction="roleAction"
      :peopleName="selectedPeople.name"
      :isPeopleAdmin="isPeopleAdmin"
      :value="changeRoleConfirmPopup"
      @onChangeRoleConfirm="handleConfirmChangeRole"
      @onClose="handleCloseChangeRolePopup(false)"
    />
  </div>
</template>
<script>
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { ref, provide, readonly, computed, onBeforeMount, defineComponent, reactive } from '@vue/composition-api'
import WorkspacePeopleList from '@/features/workspace/components/people/WorkspacePeopleList.vue'
import WorkspacePeoplePopup from '@/features/workspace/components/people/WorkspacePeoplePopup.vue'
import WorkspacePeopleNavbar from '@/features/workspace/components/people/WorkspacePeopleNavbar.vue'
import WorkspacePeopleConfirmDeletePopup from '@/features/workspace/components/people/WorkspacePeopleConfirmDeletePopup.vue'
import WorkspacePeopleConfirmChangeRolePopup from '@/features/workspace/components/people/WorkspacePeopleConfirmChangeRolePopup.vue'
import WorkspacePeopleConfirmDeleteInvitationPopup from '@/features/workspace/components/people/WorkspacePeopleConfirmDeleteInvitationPopup.vue'
import WorkspacePeopleConfirmResendInvitationPopup from '@/features/workspace/components/people/WorkspacePeopleConfirmResendInvitationPopup.vue'

export default defineComponent({
  name: 'workspace',

  components: {
    WorkspacePeopleList,
    WorkspacePeoplePopup,
    WorkspacePeopleNavbar,
    WorkspacePeopleConfirmDeletePopup,
    WorkspacePeopleConfirmChangeRolePopup,
    WorkspacePeopleConfirmResendInvitationPopup,
    WorkspacePeopleConfirmDeleteInvitationPopup
  },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()
    const { workspaceId } = context.root.$route.params

    const peoplePopup = ref(false)
    const selectedPeople = ref(null)

    const changeRoleConfirmPopup = ref(false)
    const peopleConfirmDeletePopup = ref(false)
    const peopleChangeRoleConfirmPopup = ref(false)
    const deleteInvitationConfirmPopup = ref(false)
    const resendInvitationConfirmPopup = ref(false)

    const isPeopleAdmin = computed(() => selectedPeople.value.role === 'WA')
    const role = computed(() => (isPeopleAdmin.value ? 'WM' : 'WA'))
    const roleAction = computed(() => (isPeopleAdmin.value ? 'revoke' : 'grant'))

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

    const loading = computed(() => workspaceStore.loading.value.people)

    const handleValue = value => (peoplePopup.value = value)

    const handleOpenRemovePeople = value => (peopleConfirmDeletePopup.value = true)

    const handleCloseChangeRolePopup = value => (changeRoleConfirmPopup.value = false)

    const handleChangeRole = async role => (changeRoleConfirmPopup.value = true)

    const handleConfirmChangeRole = async () => {
      const people = await workspaceStore.actions.changeRole({
        role: role.value,
        peopleId: selectedPeople.value.short_uuid,
        workspaceId: selectedPeople.value.workspace.short_uuid
      })
      if (people) {
        changeRoleConfirmPopup.value = false
        peoplePopup.value = false
      }
    }

    const handleSelectPeople = people => {
      selectedPeople.value = people
      peoplePopup.value = true
    }

    const handleDeleteItem = async () => {
      await workspaceStore.deleteWorkspacePeople(selectedPeople.value)
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
      loading,
      roleAction,
      peoplePopup,
      handleValue,
      isPeopleAdmin,
      selectedPeople,
      workspacePeople,
      handleDeleteItem,
      handleResendItem,
      handleChangeRole,
      handleSelectPeople,
      changeRoleConfirmPopup,
      handleDeleteInvitation,
      handleOpenRemovePeople,
      handleConfirmChangeRole,
      peopleConfirmDeletePopup,
      handleCloseChangeRolePopup,
      resendInvitationConfirmPopup,
      deleteInvitationConfirmPopup,
      handleDeleteInivitationPopup,
      handleCloseConfirmDeletePopup,
      handleResendInivitationPopup,
      handleCloseConfirmDeletePopup,
      workspace: workspaceStore.workspace,
      currentUser: workspaceStore.currentPeople,
      workspaceSettings: workspaceStore.workspaceSettings
    }
  }
})
</script>
