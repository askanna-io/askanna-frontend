<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="390"
      :nudge-bottom="10"
      :nudge-left="100"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" small rounded class="mr-3">
          <v-icon color="primary" left>mdi-plus</v-icon>
          Invite more people
        </v-btn>
      </template>
      <v-card>
        <v-app-bar flat dense white--text color="white">
          <v-card-title class="pb-0 pl-0">Invite more people to {{ workspaceName }}</v-card-title>

          <v-spacer></v-spacer>

          <v-btn class="pa-2 mt-5" icon @click="handleCancel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-container class="pb-0">
          <v-row no-gutters>
            <v-col class="transition-swing text-subtitle-1">
              Email address
            </v-col>
            <v-col class="transition-swing text-subtitle-1">
              Name (optional)
            </v-col>
            <v-responsive :key="`width-2`" width="100%" />
          </v-row>
        </v-container>

        <v-container id="scroll-target" ref="inviteForm" style="max-height: 400px;" class="pl-1 pt-0 overflow-y-auto">
          <template v-for="(item, index) in invationItems" v-scroll:#scroll-target>
            <v-row no-gutters :key="index">
              <v-col class="pa-2" cols="6">
                <v-text-field
                  :value="item.email"
                  @input="handleOnInput($event, index, 'email', item)"
                  @blur="handleEmailBlur($event, { index, item })"
                  @keyup.enter="handleSentInvation"
                  small
                  dense
                  hide-details
                  outlined
                />
              </v-col>
              <v-col class="pa-2" cols="6">
                <v-text-field
                  :value="item.name"
                  @input="handleOnInput($event, index, 'name', item)"
                  @keyup.enter="handleSentInvation"
                  small
                  dense
                  hide-details
                  outlined
                />
              </v-col>
            </v-row>
          </template>
        </v-container>

        <v-card-actions>
          <v-btn
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
    </v-menu>
  </div>
</template>

<script>
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

    const menu = ref(false)
    const loading = ref(false)
    const inviteForm = ref(null)
    const isNewRawAdded = ref(false)
    const loadingText = ref('Sending...')

    const invationItems = ref([
      { email: '', name: '' },
      { email: '', name: '' }
    ])

    const { workspaceId } = context.root.$route.params

    const handleOnInput = (value, index, path, item) => {
      invationItems.value.splice(index, 1, { ...item, [path]: value })
    }

    const handleEmailBlur = (event, { item, index }) => {
      inviteForm.value.scrollTop = inviteForm.value.scrollHeight
      if (index + 1 === invationItems.value.length && item.email !== '') {
        invationItems.value.push({ email: '', name: '' })
      }
    }

    const handleCancel = () => {
      menu.value = false
      invationItems.value = [
        { email: '', name: '' },
        { email: '', name: '' }
      ]
    }

    const handleSentInvation = async () => {
      const invitations = invationItems.value.filter(item => item.email !== '')

      loading.value = true

      /*   await workspaceStore.sendInvitations(invitations)

      menu.value = false
      loading.value = false */
    }

    const iSinvationItemsPlural = computed(() => invationItems.value.filter(item => item.email !== '').length)
    const invationBtnText = computed(() => (iSinvationItemsPlural.value > 1 ? 'Send invations' : 'Send invation'))

    return {
      menu,
      loading,
      inviteForm,
      loadingText,
      invationItems,
      handleCancel,
      handleOnInput,
      invationBtnText,
      handleEmailBlur,
      handleSentInvation
    }
  }
})
</script>
