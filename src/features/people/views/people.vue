<template>
  <div>
    <people-navbar />
    <template v-if="isMember">
      <people-list
        :loading="loading"
        :items="people"
        :currentUser="currentUser"
        :settings="workspaceSettings"
        :workspaceUuid="workspace.uuid"
        :workspaceName="workspace.name"
        @onSelectPoeple="handleSelectPeople"
      />
      <people-popup
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
      <people-confirm-delete-popup
        v-if="peopleConfirmDeletePopup"
        :value="peopleConfirmDeletePopup"
        :peopleName="selectedPeople.name"
        @onDeleteConfirm="handleDeleteItem"
        @onCloseDeletePopup="handleCloseConfirmDeletePopup"
      />
      <people-confirm-delete-invitation-popup
        v-if="deleteInvitationConfirmPopup"
        :peopleName="selectedPeople.name"
        :value="deleteInvitationConfirmPopup"
        @onDeleteConfirm="handleDeleteInvitation"
        @onClose="handleDeleteInivitationPopup(false)"
      />
      <people-confirm-resend-invitation-popup
        v-if="resendInvitationConfirmPopup"
        :peopleName="selectedPeople.name"
        :value="resendInvitationConfirmPopup"
        @onResendConfirm="handleResendItem"
        @onClose="handleResendInivitationPopup(false)"
      />

      <people-confirm-change-role-popup
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
import { useRouter } from '@/core/plugins/vue-hooks'
import { usePeopleStore } from '@/features/people/usePeopleStore'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import { useWorkspaceStore } from '@/features/workspace/useWorkspaceStore'

import PeopleList from '@/features/people/components/PeopleList.vue'
import PeopleNavbar from '@/features/people/components/PeopleNavbar.vue'
import PeoplePopup from '@/features/people/components/PeoplePopup.vue'
import PeopleConfirmDeletePopup from '@/features/people/components/PeopleConfirmDeletePopup.vue'
import PeopleConfirmChangeRolePopup from '@/features/people/components/PeopleConfirmChangeRolePopup.vue'
import PeopleConfirmDeleteInvitationPopup from '@/features/people/components/PeopleConfirmDeleteInvitationPopup.vue'
import PeopleConfirmResendInvitationPopup from '@/features/people/components/PeopleConfirmResendInvitationPopup.vue'

const { route } = useRouter()
const peopleStore = usePeopleStore()
const workspaceStore = useWorkspaceStore()

const { workspaceId } = route.value.params

const changeRoleTo = ref('')
const peoplePopup = ref(false)
const selectedPeople = ref(null)

const changeRoleConfirmPopup = ref(false)
const peopleConfirmDeletePopup = ref(false)
const deleteInvitationConfirmPopup = ref(false)
const resendInvitationConfirmPopup = ref(false)

const isMember = computed(() => workspaceStore.workspace.is_member)
const isPeopleAdmin = computed(() => selectedPeople.value.role === 'WA')
const roleAction = computed(() => (isPeopleAdmin.value ? 'revoke' : 'grant'))

const workspace = computed(() => workspaceStore.workspace)
const currentUser = computed(() => peopleStore.currentPeople)
const workspaceSettings = computed(() => workspaceStore.workspaceSettings)

const people = computed(() => {
  const {
    search,
    filter: { role, status },
    sorting: { sortBy, sort }
  } = peopleStore.peopleParams

  let people = [...peopleStore.people]

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

const loading = computed(() => peopleStore.loading)

const handleValue = value => (peoplePopup.value = value)

const handleOpenRemovePeople = () => (peopleConfirmDeletePopup.value = true)

const handleCloseChangeRolePopup = () => (changeRoleConfirmPopup.value = false)

const handleChangeRole = async role => {
  changeRoleTo.value = role
  changeRoleConfirmPopup.value = true
}

const handleConfirmChangeRole = async role => {
  const people = await peopleStore.changeRole({
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
  await peopleStore.deletePeople(selectedPeople.value)
  peopleConfirmDeletePopup.value = false
  peoplePopup.value = false
  deleteInvitationConfirmPopup.value = false
}

const handleDeleteInvitation = async () => {
  await peopleStore.deleteInvitation(selectedPeople.value)

  peopleConfirmDeletePopup.value = false
  peoplePopup.value = false
  deleteInvitationConfirmPopup.value = false
}

const handleCloseConfirmDeletePopup = () => (peopleConfirmDeletePopup.value = false)
const handleDeleteInivitationPopup = value => (deleteInvitationConfirmPopup.value = value)
const handleResendInivitationPopup = value => (resendInvitationConfirmPopup.value = value)

const handleResendItem = () => {
  peopleStore.resendInvitation({
    peopleId: selectedPeople.value.short_uuid,
    workspaceId: selectedPeople.value.workspace.short_uuid
  })
  resendInvitationConfirmPopup.value = false
  peoplePopup.value = false
}

const fetchData = async () => {
  await peopleStore.getPeople({ workspaceId })
}

onBeforeMount(() => fetchData())
</script>
