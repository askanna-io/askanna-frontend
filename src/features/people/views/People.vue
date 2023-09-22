<template>
  <AskAnnaBreadcrumbs
    class="ml-3 -mb-3 sm:-mb-0"
    :items="breadcrumbs"
  />

  <div class="px-0 sm:px-2">
    <PeopleList
      :currentUser="currentUser"
      :settings="workspaceSettings"
      :workspaceName="workspace.name"
      @onSelectPoeple="handleSelectPeople"
    />

    <PeoplePopup
      v-if="peoplePopup"
      :value="peoplePopup"
      :people="selectedPeople"
      :roleAction="roleAction"
      :currentUser="currentUser"
      :isPeopleAdmin="isPeopleAdmin"
      :workspaceId="workspace.suuid"
      :workspaceName="workspace.name"
      @handleValue="handleValue"
      @onChangeRole="handleChangeRole"
      @onRemovePeople="handleOpenRemovePeople"
      @onDeleteInivitationPopup="handleDeleteInivitationPopup(true)"
      @onResendInivitationPopup="handleResendInivitationPopup(true)"
    />
    <PeoplePopupDeleteUser
      v-if="peopleConfirmDeletePopup"
      :value="peopleConfirmDeletePopup"
      :peopleName="selectedPeople.name || selectedPeople.email"
      @onDeleteConfirm="handleDeleteItem"
      @onCloseDeletePopup="handleCloseConfirmDeletePopup"
    />
    <PeoplePopupDeleteInvitation
      v-if="deleteInvitationConfirmPopup"
      :value="deleteInvitationConfirmPopup"
      :peopleName="selectedPeople.name || selectedPeople.email"
      @onDeleteConfirm="handleDeleteInvitation"
      @onClose="handleDeleteInivitationPopup(false)"
    />
    <PeoplePopupResendInvitation
      v-if="resendInvitationConfirmPopup"
      :value="resendInvitationConfirmPopup"
      :peopleName="selectedPeople.name || selectedPeople.email"
      @onResendConfirm="handleResendItem"
      @onClose="handleResendInivitationPopup(false)"
    />
    <PeoplePopupChangeRole
      v-if="changeRoleConfirmPopup"
      :toRole="changeRoleTo"
      :isPeopleAdmin="isPeopleAdmin"
      :value="changeRoleConfirmPopup"
      :fromRole="selectedPeople.role.code"
      :peopleName="selectedPeople.name || selectedPeople.email"
      @onChangeRoleConfirm="handleConfirmChangeRole"
      @onClose="handleCloseChangeRolePopup(false)"
    />
  </div>
</template>
<script setup lang="ts">
const peopleStore = usePeopleStore()
const { route } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const breadcrumbs = useBreadcrumbs({ start: 0, end: 3 })

const changeRoleTo = ref('')
const peoplePopup = ref(false)
const selectedPeople = ref(null)


const changeRoleConfirmPopup = ref(false)
const peopleConfirmDeletePopup = ref(false)
const deleteInvitationConfirmPopup = ref(false)
const resendInvitationConfirmPopup = ref(false)

const isPeopleAdmin = computed(() => selectedPeople.value?.role.code === 'WA')
const roleAction = computed(() => (isPeopleAdmin.value ? 'revoke' : 'grant'))

const workspace = computed(() => workspaceStore.workspace)
const currentUser = computed(() => peopleStore.currentPeople)
const workspaceSettings = computed(() => workspaceStore.workspaceSettings)

const handleValue = value => (peoplePopup.value = value)

const handleOpenRemovePeople = () => (peopleConfirmDeletePopup.value = true)

const handleCloseChangeRolePopup = () => (changeRoleConfirmPopup.value = false)

const handleChangeRole = async role => {
  changeRoleTo.value = role
  changeRoleConfirmPopup.value = true
}

const handleConfirmChangeRole = async role_code => {
  const people = await peopleStore.changeRole({
    role_code,
    params: route.query,
    peopleId: selectedPeople.value.suuid,
    workspaceId: selectedPeople.value.workspace.suuid
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
  await peopleStore.deletePeople({ params: route.query, people: selectedPeople.value })

  peopleConfirmDeletePopup.value = false
  peoplePopup.value = false
  deleteInvitationConfirmPopup.value = false
}

const handleDeleteInvitation = async () => {
  await peopleStore.deleteInvitation({ params: route.query, people: selectedPeople.value })

  peopleConfirmDeletePopup.value = false
  peoplePopup.value = false
  deleteInvitationConfirmPopup.value = false
}

const handleCloseConfirmDeletePopup = () => (peopleConfirmDeletePopup.value = false)
const handleDeleteInivitationPopup = value => (deleteInvitationConfirmPopup.value = value)
const handleResendInivitationPopup = value => (resendInvitationConfirmPopup.value = value)

const handleResendItem = () => {
  peopleStore.resendInvitation({
    peopleId: selectedPeople.value.suuid,
    workspaceId: selectedPeople.value.workspace.suuid
  })
  resendInvitationConfirmPopup.value = false
  peoplePopup.value = false
}
</script>
