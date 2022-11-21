<template>
  <AskAnnaRow justify="center">
    <VDialog v-model="openVmodel" max-width="400px" origin content-class="overflow-x-hidden">
      <AskAnnaCard class="text-center position">
        <VAppBar flat dense white--text color="white">
          <AskAnnaSpacer />

          <AskAnnaButton icon @click="openVmodel = false">
            <AskAnnaIcon>mdi-close</AskAnnaIcon>
          </AskAnnaButton>
        </VAppBar>

        <AskAnnaContainer pa-0 class="avatar--wrapper">
          <AskAnnaRow>
            <AskAnnaCol class="pt-0 pb-0" cols="12" align-self="start">
              <AskAnnaAvatar rounded="21" :size="people.avatar ? 150 : 150" tile>
                <VImg v-if="people.avatar" class="img--rounded" :src="people.avatar.large" />
                <VImg v-else class="img--rounded" src="@/assets/icons/ask-annna-default-gravatar.png" />
              </AskAnnaAvatar>
            </AskAnnaCol>
            <AskAnnaCol :class="[people.avatar ? 'pt-1' : 'pt-0']">
              <AskAnnaChip class="role" color="primary"> {{ roleName }} </AskAnnaChip>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaContainer>
        <AskAnnaCardText>
          <AskAnnaContainer pa-0>
            <AskAnnaRow>
              <AskAnnaCol class="pt-0" cols="12" align-self="start">
                <VListItem>
                  <VListItemContent>
                    <VListItemTitle class="title">{{ people.name || people.email }}</VListItemTitle>
                    <VListItemSubtitle class="text-subtitle-2">{{ people.job_title }}</VListItemSubtitle>
                  </VListItemContent>
                </VListItem>
              </AskAnnaCol>
            </AskAnnaRow>
          </AskAnnaContainer>
        </AskAnnaCardText>

        <AskAnnaDivider />
        <AskAnnaCardActions
          v-if="people.status === 'invited' && (workspacePeopleInviteResend || workspacePeopleInviteRemove)"
          :class="{ 'pb-0': isCurrentUserAdmin, 'px-0': $vuetify.breakpoint.xsOnly }"
        >
          <AskAnnaRow dense class="mx-2" justify="space-between">
            <AskAnnaCol cols="6">
              <AskAnnaButton
                v-if="workspacePeopleInviteRemove"
                small
                block
                outlined
                text
                color="error"
                class="btn--hover"
                @click="handleDeleteInivitationPopup"
              >
                Delete invitation
              </AskAnnaButton>
            </AskAnnaCol>
            <AskAnnaCol cols="6">
              <AskAnnaButton
                v-if="workspacePeopleInviteResend"
                small
                block
                outlined
                text
                color="secondary"
                class="btn--hover"
                @click="handleResendInivitationPopup"
              >
                Resend invitation
              </AskAnnaButton>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCardActions>
        <AskAnnaCardActions v-if="currentUser.suuid === people.suuid" :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
          <AskAnnaRow dense class="mx-2" justify="space-between">
            <AskAnnaCol class="text-center" cols="12">
              <AskAnnaButton
                small
                block
                outlined
                text
                color="secondary"
                class="btn--hover"
                :to="{ name: 'workspace-profile' }"
              >
                Edit my profile
              </AskAnnaButton>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCardActions>
        <AskAnnaCardActions
          v-if="!simple && (workspacePeopleEdit || workspacePeopleRemove) && currentUser.suuid !== people.suuid"
          :class="{ 'pt-0': isCurrentUserAdmin && people.status !== 'accepted', 'px-0': $vuetify.breakpoint.xsOnly }"
        >
          <AskAnnaRow dense class="mx-2" justify="space-between">
            <AskAnnaCol v-if="workspacePeopleEdit && buttonsVisible.WA" class="text-center" cols="12">
              <div>
                <AskAnnaButton
                  small
                  block
                  outlined
                  text
                  color="secondary"
                  class="btn--hover"
                  @click="handleChangeRole('WA')"
                >
                  MAKE {{ people.name }} A WORKSPACE ADMIN
                </AskAnnaButton>
              </div>
            </AskAnnaCol>
            <AskAnnaCol v-if="workspacePeopleEdit && buttonsVisible.WM" class="text-center" cols="12">
              <div>
                <AskAnnaButton
                  small
                  block
                  outlined
                  text
                  color="secondary"
                  class="btn--hover"
                  @click="handleChangeRole('WM')"
                >
                  MAKE {{ people.name }} A WORKSPACE MEMBER
                </AskAnnaButton>
              </div>
            </AskAnnaCol>
            <AskAnnaCol v-if="workspacePeopleEdit && buttonsVisible.WV" class="text-center" cols="12">
              <div>
                <AskAnnaButton
                  small
                  block
                  outlined
                  text
                  color="secondary"
                  class="btn--hover"
                  @click="handleChangeRole('WV')"
                >
                  MAKE {{ people.name }} A WORKSPACE VIEWER
                </AskAnnaButton>
              </div>
            </AskAnnaCol>
            <AskAnnaCol class="text-center" cols="12" v-if="people.status === 'accepted' && workspacePeopleRemove">
              <div :class="{ 'mt-2': people.status === 'accepted' }">
                <AskAnnaButton
                  small
                  block
                  outlined
                  text
                  color="error"
                  class="btn--hover"
                  max-width="340"
                  @click="handleRemove"
                >
                  Remove&nbsp;{{ name }}
                </AskAnnaButton>
              </div>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaCardActions>
      </AskAnnaCard>
    </VDialog>
  </AskAnnaRow>
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
        created: '',
        modified: '',
        job_title: '',
        suuid: '',
        last_active: ''
      }
    }
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
const permission = usePermission()

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
  const val = props.people.role.code
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
<style scoped>
.role {
  white-space: nowrap;
  display: inline-block;
}
</style>
