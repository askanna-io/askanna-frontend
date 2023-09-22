<template>
  <VDialog
    width="500"
    v-model="menu"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <AskAnnaButton
        v-bind="props"
        variant="elevated"
        colorIcon="primary"
        prependIcon="mdi-plus"
        class="mr-3 rounded-full"
      >
        {{ $vuetify.display.xs ? 'Invite people' : 'Invite more people' }}
      </AskAnnaButton>
    </template>
    <AskAnnaCard
      class="pl-1"
      :class="{ 'pt-2': $vuetify.display.xs }"
    >
      <AskAnnaCardTitle class="pr-0 pl-3">
        <div class="flex items-start justify-between sm:items-center">
          <p class="whitespace-pre-wrap sm:truncate">Invite more people to <span class="text-primary">{{ title
          }}</span>
          </p>
          <AskAnnaButton
            class="mr-0.5"
            variant="text"
            icon="mdi-close"
            @click="handleCancel"
          />
        </div>
      </AskAnnaCardTitle>
      <div
        style="max-height: 400px"
        class="pr-1 overflow-y-auto"
      >
        <div no-gutters>
          <div class="px-3 py-2">
            <VCombobox
              counter
              multiple
              clearable
              autofocus
              hide-details
              color="primary"
              deletable-chips
              variant="outlined"
              :delimiters="[' ']"
              label="Invitations"
              v-model="invitationItems"
              placeholder="Type emails here"
            >
              <template v-slot:selection="data">
                <VChip
                  closable
                  text-color="white"
                  v-bind="data.attrs"
                  @click="data.select"
                  :model-value="data.selected"
                  :color="getStyle(data.item.value).color"
                  @click:close="handleRemove(data.item.value)"
                  :prepend-icon="getStyle(data.item.value).icon"
                >
                  {{ data.item.value }}
                </VChip>
              </template>
            </VCombobox>
            <VChip
              v-if="inValidEmails.length"
              color="error"
              class="mt-2 pl-1 text-white"
              @click="handleRemoveInValidEmails"
            >
              <AskAnnaAvatar
                color="white"
                class="text-error mr-1"
              >
                {{ inValidEmails.length }}
              </AskAnnaAvatar>
              Remove {{ inValidEmails.length }} invalid email{{ inValidEmails.length > 1 ? 's' : '' }}
            </VChip>
            <VChip
              v-if="invitedEmails.length"
              color="primary"
              class="mt-2 pl-1"
              @click="handleRemoveInvitedEmails"
            >
              <AskAnnaAvatar
                color="white"
                class="text-primary mr-1"
              >
                {{ invitedEmails.length }}
              </AskAnnaAvatar>
              Remove {{ invitedEmails.length }} email{{ invitedEmails.length > 1 ? 's' : '' }} of existing member{{
                invitedEmails.length > 1 ? 's' : ''
              }}
            </VChip>
          </div>
        </div>
        <div class="px-3 py-2">
          <AskAnnaSelectOutlined
            hide-details
            return-object
            persistent-hint
            item-title="name"
            item-value="code"
            label="Invite as"
            :items="listAccess"
            v-model="selectedAccess"
          />
        </div>
      </div>

      <div class="px-3 pt-2 pb-3">
        <AskAnnaButton
          :loading="loading"
          prependIcon="mdi-mail"
          :loadingText="loadingText"
          :disabled="!invitationItems.length || Boolean(inValidEmails.length) || Boolean(invitedEmails.length)"
          @click="handleSentInvitation"
        >
          {{ invitationBtnText }}
        </AskAnnaButton>
      </div>
    </AskAnnaCard>
  </VDialog>
</template>

<script setup lang="ts">

const slicedText = useSlicedText()
const peopleStore = usePeopleStore()
const { route } = useRouterAskAnna()
const workspaceStore = useWorkspaceStore()
const { isValidEmail } = useValidationRules()

const workspaceId = computed(() => route.params.workspaceId)
const workspaceName = computed(() => workspaceStore.workspace.name)
const currentRole = computed(() => peopleStore.currentPeople.role.code)

const menu = ref(false)
const loading = ref(false)
const invitedEmails = ref([])
const invitationItems = ref([])
const loadingText = ref('Sending...')
const selectedAccess = ref({ code: 'WM', name: 'Workspace member' }) //default member access

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

const title = computed(() => slicedText(workspaceName.value, 27))
const invitationBtnText = computed(() => (invitationItems.value.length > 1 ? 'Send invitations' : 'Send invitation'))
const inValidEmails = computed(() => invitationItems.value.filter(email => !isValidEmail(email)))

watch(invitationItems, async emails => {
  if (!emails.length) return
  invitedEmails.value = await peopleStore.checkPeopleByEmails({ suuid: workspaceId.value, emails })
})

const handleCancel = () => {
  menu.value = false
  invitationItems.value = []
}

const handleSentInvitation = async () => {
  loading.value = true
  const reducer = (acc, email) => {
    const isExist = peopleStore.people.results.find(item => item.email === email)

    if (!isExist) {
      acc.push(email)
    }
    return acc
  }

  const emails = invitationItems.value.reduce(reducer, [])
  if (emails.length) {
    await peopleStore.sendInvitations({ emails, params: route.query, role_code: selectedAccess.value.code })
  }

  menu.value = false
  loading.value = false
  invitationItems.value = []
}

const handleRemove = item => {
  invitationItems.value.splice(invitationItems.value.indexOf(item), 1)
  invitedEmails.value.splice(invitedEmails.value.indexOf(item), 1)
}

const handleRemoveInValidEmails = () => {
  invitationItems.value = invitationItems.value.filter(email => isValidEmail(email))
}

const handleRemoveInvitedEmails = () => {
  invitationItems.value = invitationItems.value.filter(email => !invitedEmails.value.includes(email))
  invitedEmails.value = []
}

const getStyle = email => {
  const isEmailValid = isValidEmail(email)

  const isExist = peopleStore.people.results.find(item => item.email === email)
  const isInvited = isExist && isExist.status === 'invited'
  const isActive = isExist && isExist.status === 'active'
  const icons = {
    error: 'mdi-email-off-outline',
    invited: 'mdi-email-send-outline',
    active: 'mdi-email-check-outline'
  }

  const icon = (isExist && icons[isExist.status]) || (!isEmailValid && icons.error) || ''
  const colors = { error: !isEmailValid, primary: isActive, 'accent': isInvited }

  return {
    icon,
    color: Object.keys(colors).filter(k => colors[k])[0] || ''
  }
}
</script>

<style lang="scss">
.v-combobox--multiple .v-field__input {
  @apply gap-1;

  input {
    padding-top: 4px;
  }

  .v-field__clearable {
    padding-top: 20px;
  }
}
</style>