<template>
  <div class="text-center">
    <VDialog content-class="invite-popup" v-model="menu" :close-on-content-click="false" width="500">
      <template v-slot:activator="{ on, attrs }">
        <AskAnnaButton v-bind="attrs" v-on="on" small rounded class="mr-3">
          <AskAnnaIcon color="primary" left>mdi-plus</AskAnnaIcon>
          {{ $vuetify.breakpoint.xsOnly ? 'Invite  people' : 'Invite more people' }}
        </AskAnnaButton>
      </template>
      <AskAnnaCard>
        <AskAnnaToolbar flat dense white--text color="white">
          <AskAnnaToolbarTitle class="px-0"
            >Invite more people to <span class="primary--text">{{ title }}</span></AskAnnaToolbarTitle
          >
          <AskAnnaSpacer />

          <AskAnnaButton icon @click="handleCancel">
            <AskAnnaIcon>mdi-close</AskAnnaIcon>
          </AskAnnaButton>
        </AskAnnaToolbar>
        <AskAnnaContainer id="scroll-target" style="max-height: 400px" class="pl-1 pt-0 overflow-y-auto">
          <AskAnnaRow no-gutters>
            <AskAnnaCol class="pa-2" cols="12">
              <VCombobox
                hide-details=""
                :delimiters="[' ']"
                append-icon=""
                v-model="invitationItems"
                chips
                counter
                outlined
                multiple
                clearable
                autofocus
                deletable-chips
                label="Invitations"
                placeholder="Type emails here"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <AskAnnaChip
                    v-bind="attrs"
                    :input-value="selected"
                    :class="getStyle(item).color"
                    close
                    @click="select"
                    @click:close="handleRemove(item)"
                  >
                    <AskAnnaIcon left>
                      {{ getStyle(item).icon }}
                    </AskAnnaIcon>
                    <strong>{{ item }}</strong
                    >&nbsp;
                    <span></span>
                  </AskAnnaChip>
                </template>
              </VCombobox>
              <AskAnnaChip class="mt-2" v-if="inValidEmails.length" color="error" @click="handleRemoveInValidEmails">
                <AskAnnaAvatar color="white" left class="error--text">
                  {{ inValidEmails.length }}
                </AskAnnaAvatar>
                Remove {{ inValidEmails.length }} invalid email{{ inValidEmails.length > 1 ? 's' : '' }}
              </AskAnnaChip>
              <AskAnnaChip class="mt-2" v-if="invitedEmails.length" color="primary" @click="handleRemoveInvitedEmails">
                <AskAnnaAvatar color="white" left class="primary--text">
                  {{ invitedEmails.length }}
                </AskAnnaAvatar>
                Remove {{ invitedEmails.length }} email{{ invitedEmails.length > 1 ? 's' : '' }} of existing member{{
                  invitedEmails.length > 1 ? 's' : ''
                }}
              </AskAnnaChip>
            </AskAnnaCol>
          </AskAnnaRow>
          <AskAnnaRow no-gutters>
            <AskAnnaCol class="pa-2" cols="12">
              <AskAnnaSelect
                v-model="selectedAccess"
                :items="listAccess"
                dense
                outlined
                return-object
                hide-details
                item-text="name"
                item-value="code"
                persistent-hint
                label="Invite as"
              />
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaContainer>

        <AskAnnaCardActions>
          <AskAnnaButton
            :disabled="!invitationItems.length || Boolean(inValidEmails.length) || Boolean(invitedEmails.length)"
            :loading="loading"
            text
            small
            outlined
            color="secondary"
            class="ml-0 btn--hover"
            @click="handleSentInvitation"
          >
            <AskAnnaIcon left> mdi-mail </AskAnnaIcon>
            {{ invitationBtnText }}
            <template v-slot:loader>
              <AskAnnaIcon left> mdi-mail </AskAnnaIcon>
              <span>{{ loadingText }}...</span>
              <AskAnnaIcon class="ask-anna-btn-loader"> mdi-loading </AskAnnaIcon>
            </template>
          </AskAnnaButton>
        </AskAnnaCardActions>
      </AskAnnaCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  workspaceName: {
    type: String,
    default: ''
  }
})

const slicedText = useSlicedText()
const peopleStore = usePeopleStore()
const { isValidEmail } = useValidationRules()

const currentRole = computed(() => peopleStore.currentPeople.role.code)

const menu = ref(false)
const loading = ref(false)
const selectedAccess = ref({ code: 'WM', name: 'member' }) //default member access

const listAccess = computed(() => {
  let list = [
    { code: 'WM', name: 'Workspace member' },
    { code: 'WV', name: 'Workspace viewer' }
  ]
  if (currentRole.value === 'WA') {
    list = [{ code: 'WA', name: 'Workspace admin' }, ...list]
  }
  return list
})

const invitationItems = ref([])
const loadingText = ref('Sending...')

const title = computed(() => slicedText(props.workspaceName, 27))

const invitationBtnText = computed(() => (invitationItems.value.length > 1 ? 'Send invitations' : 'Send invitation'))
const inValidEmails = computed(() => invitationItems.value.filter(email => !isValidEmail(email)))
const invitedEmails = computed(() =>
  invitationItems.value.filter(email => peopleStore.people.some(item => item.email === email) && email)
)

const handleCancel = () => {
  menu.value = false
  invitationItems.value = []
}

const handleSentInvitation = async () => {
  loading.value = true
  const reducer = (acc, email) => {
    const isExist = peopleStore.people.find(item => item.email === email)

    if (!isExist) {
      acc.push(email)
    }
    return acc
  }

  const emails = invitationItems.value.reduce(reducer, [])
  if (emails.length) {
    await peopleStore.sendInvitations({ emails, role: selectedAccess.value.code })
  }

  menu.value = false
  loading.value = false
  invitationItems.value = []
}

const handleRemove = item => invitationItems.value.splice(invitationItems.value.indexOf(item), 1)

const handleRemoveInValidEmails = () => {
  invitationItems.value = invitationItems.value.filter(email => isValidEmail(email))
}

const handleRemoveInvitedEmails = () => {
  invitationItems.value = invitationItems.value.filter(email => !invitedEmails.value.includes(email))
}

const getStyle = email => {
  const isEmailValid = !isValidEmail(email)
  const isExist = peopleStore.people.find(item => item.email === email)
  const isInvited = isExist && isExist.status === 'invited'
  const isAccepted = isExist && isExist.status === 'accepted'
  const icons = {
    error: 'mdi-email-off-outline',
    invited: 'mdi-email-send-outline',
    accepted: 'mdi-email-check-outline'
  }

  const icon = (isExist && icons[isExist.status]) || (isEmailValid && icons.error) || ''

  return {
    color: {
      error: isEmailValid,
      primary: isAccepted,
      'blue lighten-3': isInvited
    },
    icon
  }
}
</script>
<style lang="scss">
.mobile-view .v-dialog {
  margin: 12px;
}
</style>
