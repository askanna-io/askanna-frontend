<template>
  <div>
    <workspace-people-navbar />
    <template v-if="isMember">
      <workspace-people-list
        :loading="loading"
        :items="workspacePeople"
        :currentUser="currentUser"
        :settings="workspaceSettings"
        :workspaceUuid="workspace.uuid"
        :workspaceName="workspace.name"
        @onSelectPoeple="handleSelectPeople"
      />
      <workspace-people-popup
        v-if="peoplePopup"
        :value="peoplePopup"
        :people="selectedPeople"
        :currentUser="currentUser"
        :workspaceName="workspace.name"
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
        :toRole="changeRoleTo"
        :fromRole="selectedPeople.role.code"
        :isPeopleAdmin="isPeopleAdmin"
        :value="changeRoleConfirmPopup"
        :peopleName="selectedPeople.name || selectedPeople.email"
        @onChangeRoleConfirm="handleConfirmChangeRole"
        @onClose="handleCloseChangeRolePopup(false)"
      />
    </template>
    <v-alert v-else class="text-center" dense outlined>
      You are not allowed to see the peope list of this workspace. I can bring you back to the workspace
      <router-link :to="{ name: 'workspace' }" class="ask-anna-link">{{ workspace.name }}</router-link
      >.
    </v-alert>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from '@u3u/vue-hooks'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import WorkspacePeopleList from '@/features/workspace/components/people/WorkspacePeopleList.vue'
import WorkspacePeoplePopup from '@/features/workspace/components/people/WorkspacePeoplePopup.vue'
import WorkspacePeopleNavbar from '@/features/workspace/components/people/WorkspacePeopleNavbar.vue'
import WorkspacePeopleConfirmDeletePopup from '@/features/workspace/components/people/WorkspacePeopleConfirmDeletePopup.vue'
import WorkspacePeopleConfirmChangeRolePopup from '@/features/workspace/components/people/WorkspacePeopleConfirmChangeRolePopup.vue'
import WorkspacePeopleConfirmDeleteInvitationPopup from '@/features/workspace/components/people/WorkspacePeopleConfirmDeleteInvitationPopup.vue'
import WorkspacePeopleConfirmResendInvitationPopup from '@/features/workspace/components/people/WorkspacePeopleConfirmResendInvitationPopup.vue'

const { route } = useRouter()
const workspaceStore = useWorkspaceStore()
const { workspaceId } = route.value.params

const changeRoleTo = ref('')
const peoplePopup = ref(false)
const selectedPeople = ref(null)

const changeRoleConfirmPopup = ref(false)
const peopleConfirmDeletePopup = ref(false)
const deleteInvitationConfirmPopup = ref(false)
const resendInvitationConfirmPopup = ref(false)

const isPeopleAdmin = computed(() => selectedPeople.value.role === 'WA')
const isMember = computed(() => workspaceStore.workspace.value.is_member)
const roleAction = computed(() => (isPeopleAdmin.value ? 'revoke' : 'grant'))

const workspace = computed(() => workspaceStore.workspace.value)
const currentUser = computed(() => workspaceStore.currentPeople.value)
const workspaceSettings = computed(() => workspaceStore.workspaceSettings.value)

const workspacePeople = computed(() => {
  const {
    search,
    filter: { role, status },
    sorting: { sortBy, sort }
  } = workspaceStore.workspacePeopleParams.value

  let people = [...workspaceStore.workspacePeople.value]

  if (!people.length) return people

  if (role) {
    people = people.filter(item => item.role?.code === role)
  }

  if (status) {
    people = people.filter(item => item.status === status)
  }

  if (sortBy && sort) {
    people = people.sort((a, b) => {
      const nameA = (a.name && a.name.toLowerCase()) || a.email.toLowerCase()
      const nameB = (b.name && b.name.toLowerCase()) || b.email.toLowerCase()

      if (nameA < nameB) return -sort
      if (nameA > nameB) return sort

      return 0
    })
  }

  return people
})

const loading = computed(() => workspaceStore.loading.value.people)

const handleValue = value => (peoplePopup.value = value)

const handleOpenRemovePeople = () => (peopleConfirmDeletePopup.value = true)

const handleCloseChangeRolePopup = () => (changeRoleConfirmPopup.value = false)

const handleChangeRole = async role => {
  changeRoleTo.value = role
  changeRoleConfirmPopup.value = true
}

const handleConfirmChangeRole = async role => {
  const people = await workspaceStore.actions.changeRole({
    role,
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

const handleCloseConfirmDeletePopup = () => (peopleConfirmDeletePopup.value = false)
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

const fetchData = async () => {
  await workspaceStore.actions.getWorkspacePeople({ workspaceId })
}

onBeforeMount(() => fetchData())
</script>
