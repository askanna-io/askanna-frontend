<template>
  <div class="text-center">
    <v-dialog v-model="menu" :close-on-content-click="false" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" small rounded class="mr-3">
          <v-icon color="primary" left>mdi-plus</v-icon>
          Invite more people
        </v-btn>
      </template>
      <v-card>
        <v-app-bar flat dense white--text color="white">
          <v-card-title class="pb-0 pl-0">Invite more people to {{ workspaceName }}</v-card-title>

          <v-spacer />

          <v-btn class="pa-2 mt-5" icon @click="handleCancel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-container id="scroll-target" style="max-height: 400px;" class="pl-1 pt-0 overflow-y-auto">
          <v-row no-gutters>
            <v-col class="pa-2" cols="12">
              <v-combobox
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
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    :class="getStyle(item).color"
                    close
                    @click="select"
                    @click:close="handleRemove(item)"
                  >
                    <v-icon left>
                      {{ getStyle(item).icon }}
                    </v-icon>
                    <strong>{{ item }}</strong
                    >&nbsp;
                    <span></span>
                  </v-chip>
                </template>
              </v-combobox>
              <v-chip class="mt-2" v-if="inValidEmails.length" color="error" @click="handleRemoveInValidEmails">
                <v-avatar color="white" left class="error--text">
                  {{ inValidEmails.length }}
                </v-avatar>
                Remove {{ inValidEmails.length }} invalid email{{ inValidEmails.length > 1 ? 's' : '' }}
              </v-chip>
              <v-chip class="mt-2" v-if="invitedEmails.length" color="primary" @click="handleRemoveInvitedEmails">
                <v-avatar color="white" left class="primary--text">
                  {{ invitedEmails.length }}
                </v-avatar>
                Remove {{ invitedEmails.length }} email{{ invitedEmails.length > 1 ? 's' : '' }} of existing member{{
                  invitedEmails.length > 1 ? 's' : ''
                }}
              </v-chip>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-btn
            :disabled="!invitationItems.length || Boolean(inValidEmails.length) || Boolean(invitedEmails.length)"
            :loading="loading"
            text
            small
            outlined
            color="secondary"
            class="mr-1 ml-1 btn--hover"
            @click="handleSentInvitation"
          >
            <v-icon left>
              mdi-mail
            </v-icon>
            {{ invitationBtnText }}
            <template v-slot:loader>
              <v-icon left>
                mdi-mail
              </v-icon>
              <span>{{ loadingText }}...</span>
              <v-icon class="ask-anna-btn-loader">
                mdi-loading
              </v-icon>
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import useValidationRules from '@/core/composition/useValidationRules'
import { ref, computed, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  name: 'WorkspacePeopleInvitePopup',

  props: {
    workspaceName: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const workspaceStore = useWorkspaceStore()
    const validationRules = useValidationRules()

    const menu = ref(false)
    const loading = ref(false)
    const invitationItems = ref([])
    const isNewRawAdded = ref(false)
    const loadingText = ref('Sending...')

    const { workspaceId } = context.root.$route.params

    const invitationBtnText = computed(() => (invitationItems.value.length > 1 ? 'Send invitations' : 'Send invitation'))
    const inValidEmails = computed(() => invitationItems.value.filter(email => !validationRules.isValidEmail(email)))
    const invitedEmails = computed(() =>
      invitationItems.value.filter(
        email => workspaceStore.workspacePeople.value.some(item => item.email === email) && email
      )
    )

    const handleOnInput = (value, index, path, item) => invitationItems.value.splice(index, 1, { ...item, [path]: value })

    const handleCancel = () => {
      menu.value = false
      invitationItems.value = []
    }

    const handleSentInvitation = async () => {
      loading.value = true
      const reducer = (acc, email) => {
        const isExist = workspaceStore.workspacePeople.value.find(item => item.email === email)

        if (!isExist) {
          acc.push(email)
        }
        return acc
      }

      const emails = invitationItems.value.reduce(reducer, [])
      if (emails.length) {
        await workspaceStore.sendInvitations(emails)
      }

      menu.value = false
      loading.value = false
      invitationItems.value = []
    }

    const handleRemove = item => invitationItems.value.splice(invitationItems.value.indexOf(item), 1)

    const handleRemoveInValidEmails = () => {
      invitationItems.value = invitationItems.value.filter(email => validationRules.isValidEmail(email))
    }

    const handleRemoveInvitedEmails = () => {
      invitationItems.value = invitationItems.value.filter(email => !invitedEmails.value.includes(email))
    }

    const getStyle = email => {
      const isEmailValid = !validationRules.isValidEmail(email)
      const isExist = workspaceStore.workspacePeople.value.find(item => item.email === email)
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

    return {
      menu,
      loading,
      getStyle,
      loadingText,
      handleRemove,
      handleCancel,
      invitationItems,
      handleOnInput,
      inValidEmails,
      invitedEmails,
      invitationBtnText,
      handleSentInvitation,
      handleRemoveInvitedEmails,
      handleRemoveInValidEmails
    }
  }
})
</script>
