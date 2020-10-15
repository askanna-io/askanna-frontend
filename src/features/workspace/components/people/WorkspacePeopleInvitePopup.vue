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
                v-model="invationItems"
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
                Delete {{ inValidEmails.length }} invalid email{{ inValidEmails.length > 1 ? 's' : '' }}
              </v-chip>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-btn
            :disabled="!invationItems.length || Boolean(inValidEmails.length)"
            :loading="loading"
            text
            small
            outlined
            color="secondary"
            class="mr-1 ml-1 btn--hover"
            @click="handleSentInvation"
          >
            <v-icon left>
              mdi-mail
            </v-icon>
            {{ invationBtnText }}
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
    const invationItems = ref([])
    const isNewRawAdded = ref(false)
    const loadingText = ref('Sending...')

    const { workspaceId } = context.root.$route.params

    const invationBtnText = computed(() => (invationItems.value.length > 1 ? 'Send invations' : 'Send invation'))
    const inValidEmails = computed(() => invationItems.value.filter(email => !validationRules.isValidEmail(email)))

    const handleOnInput = (value, index, path, item) => invationItems.value.splice(index, 1, { ...item, [path]: value })

    const handleCancel = () => {
      menu.value = false
      invationItems.value = []
    }

    const handleSentInvation = async () => {
      loading.value = true
      const reducer = (acc, email) => {
        const isExist = workspaceStore.workspacePeople.value.find(item => item.email === email)

        if (!isExist) {
          acc.push(email)
        }
        return acc
      }

      const emails = invationItems.value.reduce(reducer, [])
      if (emails.length) {
        await workspaceStore.sendInvitations(emails)
      }

      menu.value = false
      loading.value = false
      invationItems.value = []
    }

    const handleRemove = item => invationItems.value.splice(invationItems.value.indexOf(item), 1)

    const handleRemoveInValidEmails = () => {
      invationItems.value = invationItems.value.filter(email => validationRules.isValidEmail(email))
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
          green: isAccepted,
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
      invationItems,
      handleOnInput,
      inValidEmails,
      invationBtnText,
      handleSentInvation,
      handleRemoveInValidEmails
    }
  }
})
</script>
