<template>
  <VDialog
    max-width="400px"
    v-model="openVmodel"
  >
    <AskAnnaCard>
      <AskAnnaCardTitle>
        <div class="flex items-start justify-between sm:items-center">
          <AskAnnaSpacer />

          <AskAnnaButton
            class="ml-4"
            variant="text"
            icon="mdi-close"
            @click="openVmodel = false"
          />
        </div>
      </AskAnnaCardTitle>

      <div class="flex items-center justify-center">
        <div>
          <div>
            <AskAnnaAvatar
              rounded="21"
              :size="people.avatar ? 150 : 150"
            >
              <VImg
                v-if="people.avatar"
                :src="people.avatar.large"
              />
              <VImg
                v-else
                src="/assets/icons/askanna-default-gravatar.png"
              />
            </AskAnnaAvatar>
          </div>
          <div
            class="flex justify-center"
            :class="[people.avatar ? 'pt-1' : 'pt-0']"
          >
            <AskAnnaChip color="primary">
              {{ roleName }}
            </AskAnnaChip>
          </div>
        </div>
      </div>
      <AskAnnaCardText class="text-center pt-0">
        <AskAnnaCardTitle class="pb-0">{{ people.name || people.email }}</AskAnnaCardTitle>
        <AskAnnaCardSubTitle>{{ people.job_title }}</AskAnnaCardSubTitle>
      </AskAnnaCardText>

      <AskAnnaDivider />

      <AskAnnaCardActions
        v-if="people.status === 'invited' && (workspacePeopleInviteResend || workspacePeopleInviteRemove)"
        class="flex gap-2 px-2 sm:px-6"
        :class="{ 'pb-0': isCurrentUserAdmin }"
      >
        <AskAnnaButton
          v-if="workspacePeopleInviteRemove"
          block
          color="error"
          @click="handleDeleteInivitationPopup"
        >
          Delete invitation
        </AskAnnaButton>
        <AskAnnaButton
          v-if="workspacePeopleInviteResend"
          block
          @click="handleResendInivitationPopup"
        >
          Resend invitation
        </AskAnnaButton>
      </AskAnnaCardActions>
      <AskAnnaCardActions
        v-if="currentUser.suuid === people.suuid"
        class="px-2 sm:px-6"
      >
        <AskAnnaButton
          block
          :to="{ name: 'workspace-profile', params: { workspaceId } }"
        >
          Edit my profile
        </AskAnnaButton>
      </AskAnnaCardActions>
      <div
        v-if="!simple && (workspacePeopleEdit || workspacePeopleRemove) && currentUser.suuid !== people.suuid"
        class="flex flex-col w-full px-2 sm:px-6 py-3 gap-2"
      >
        <AskAnnaButton
          v-if="workspacePeopleEdit && buttonsVisible.WA"
          block
          @click="handleChangeRole('WA')"
        >
          MAKE {{ people.name }} A WORKSPACE ADMIN
        </AskAnnaButton>

        <AskAnnaButton
          v-if="workspacePeopleEdit && buttonsVisible.WM"
          block
          @click="handleChangeRole('WM')"
        >
          MAKE {{ people.name }} A WORKSPACE MEMBER
        </AskAnnaButton>

        <AskAnnaButton
          v-if="workspacePeopleEdit && buttonsVisible.WV"
          block
          @click="handleChangeRole('WV')"
        >
          MAKE {{ people.name }} A WORKSPACE VIEWER
        </AskAnnaButton>

        <AskAnnaButton
          v-if="people.status === 'active' && workspacePeopleRemove"
          block
          class="mt-3"
          color="error"
          @click="handleRemove"
        >
          Remove&nbsp;{{ name }}
        </AskAnnaButton>
      </div>
    </AskAnnaCard>
  </VDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  people: {
    type: Object,
    default: function () {
      return {
        suuid: '',
        name: '',
        role: {
          name: '',
          code: ''
        },
        status: '',
        avatar: '',
        created_at: '',
        modified_at: '',
        job_title: '',
        last_active: ''
      }
    }
  },
  workspaceId: {
    type: String,
    default: () => ''
  },
  workspaceName: {
    type: String,
    default: () => ''
  },
  value: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: Object,
    default: function () {
      return {
        email: '',
        name: '',
        job_title: '',
        role: {
          name: '',
          code: ''
        }
      }
    }
  },
  isPeopleAdmin: {
    type: Boolean,
    default: false
  },
  roleAction: {
    type: String,
    default: () => 'revoke'
  },
  simple: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'handleValue',
  'onChangeRole',
  'onRemovePeople',
  'onDeleteInivitationPopup',
  'onResendInivitationPopup'
])

const slicedText = useSlicedText()
const permission = useAskAnnaPermission()

const openVmodel = computed({
  get: () => props.value,
  set: value => emits('handleValue', value)
})

const roleFilters = {
  WA: 'Workspace admin',
  WM: 'Workspace member',
  WV: 'Workspace viewer'
}

const roleName = computed(() => {
  const val = props.people.role?.code
  return roleFilters[val]
})

const buttonsVisible = computed(() => ({
  WA: props.people.role.code !== 'WA',
  WM: props.people.role.code !== 'WM',
  WV: props.people.role.code !== 'WV'
}))

const workspacePeopleEdit = computed(() => permission.getFor(permission.labels.workspacePeopleEdit))
const workspacePeopleRemove = computed(() => permission.getFor(permission.labels.workspacePeopleRemove))
const workspacePeopleInviteRemove = computed(() => permission.getFor(permission.labels.workspacePeopleInviteRemove))
const workspacePeopleInviteResend = computed(() => permission.getFor(permission.labels.workspacePeopleInviteResend))

const name = computed(() => slicedText(props.people.name || props.people.email, 30))
const isCurrentUserAdmin = computed(() => props.currentUser.role.code === 'WA')

const handleRemove = value => emits('onRemovePeople', value)
const handleChangeRole = value => emits('onChangeRole', value)
const handleDeleteInivitationPopup = () => emits('onDeleteInivitationPopup')
const handleResendInivitationPopup = () => emits('onResendInivitationPopup')
</script>