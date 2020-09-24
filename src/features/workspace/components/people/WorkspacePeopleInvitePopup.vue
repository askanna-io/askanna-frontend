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
        <v-card-title class="pl-3 pb-0">Invite more people to {{ workspaceName }}</v-card-title>
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
          <v-btn small outlined text color="secondary" class="mr-1 btn--hover" @click="handleSentInvation">
            {{ invationBtnText }}
          </v-btn>
          <v-btn small outlined text class="mr-1" @click="handleCancel">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspacePeopleInvitePopup',

  props: {
    workspaceName: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const menu = ref(false)
    const inviteForm = ref(null)
    const isNewRawAdded = ref(false)

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
    }

    const handleSentInvation = () => {
      menu.value = false
    }

    const invationItems = ref([
      { email: '', name: '' },
      { email: '', name: '' }
    ])

    const iSinvationItemsPlural = computed(() => invationItems.value.filter(item => item.email !== '').length)
    const invationBtnText = computed(() => (iSinvationItemsPlural.value > 1 ? 'Send invations' : 'Send invation'))

    return {
      menu,
      inviteForm,
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
