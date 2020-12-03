<template>
  <v-row justify="center">
    <v-dialog v-model="openVmodel" max-width="400px" origin>
      <v-card class="text-center position">
        <v-app-bar flat dense white--text color="white">
          <v-spacer />

          <v-btn icon @click="openVmodel = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>

        <v-container pa-0 class="avatar--wrapper">
          <v-row>
            <v-col class="pt-0 pb-0" cols="12" align-self="start">
              <v-avatar rounded="21" :size="people.avatar ? 150 : 150" tile>
                <v-img v-if="people.avatar" class="img--rounded" :src="people.avatar" />
                <v-img v-else class="img--rounded" src="@/assets/icons/ask-annna-default-gravatar.png" />
              </v-avatar>
            </v-col>
            <v-col :class="[people.avatar ? 'pt-1' : 'pt-0']">
              <v-chip class="role" color="primary">
                {{ roleName }}
              </v-chip>
            </v-col>
          </v-row>
        </v-container>
        <v-card-text>
          <v-container pa-0>
            <v-row>
              <v-col class="pt-0" cols="12" align-self="start">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="title">{{ people.name || people.email }}</v-list-item-title>
                    <v-list-item-subtitle>{{ people.job_title }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />

        <v-card-actions v-if="people.status === 'invited'">
          <v-row class="mx-2">
            <v-col cols="6">
              <v-btn small block outlined text color="error" class="btn--hover" @click="handleDeleteInivitationPopup">
                Delete invitation
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                small
                block
                outlined
                text
                color="secondary"
                class="btn--hover"
                @click="handleResendInivitationPopup"
              >
                Resend invitation
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-actions v-if="isNotBeta">
          <v-row class="mx-2">
            <v-col class="text-center" cols="12">
              <div v-if="isNotBeta">
                <v-btn small block outlined text color="secondary" class="btn--hover" @click="handleChangeRole">
                  Make Admin
                </v-btn>
              </div>
              <div class="mt-2">
                <v-btn small block outlined text color="error" class="btn--hover" @click="handleRemove">
                  Remove&nbsp;<br /><span class="secondary--text">{{ name }}</span>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import useSlicedText from '@/core/composition/useSlicedText'
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspacePeoplePopup',

  props: {
    people: {
      type: Object,
      default: function () {
        return {
          uuid: '',
          name: '',
          role: '',
          status: '',
          avatar: '',
          created: '',
          modified: '',
          job_title: '',
          short_uuid: '',
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
    }
  },
  setup(props, context) {
    const dialog = ref(false)
    const slicedText = useSlicedText()

    const openVmodel = computed({
      get: () => props.value,
      set: value => context.emit('handleValue', value)
    })

    const roleFilters = {
      ALL: 'All types',
      WA: 'Admin',
      WM: 'Member'
    }

    const roleName = computed(() => {
      const val = props.people.role
      return roleFilters[val]
    })

    const name = computed(() => slicedText(props.people.name || props.people.email, 17))

    const handleRemove = value => context.emit('onRemovePeople', value)
    const handleChangeRole = value => context.emit('handleChangeRole', value)
    const handleDeleteInivitationPopup = () => context.emit('onDeleteInivitationPopup')
    const handleResendInivitationPopup = () => context.emit('onResendInivitationPopup')

    return {
      name,
      dialog,
      roleName,
      openVmodel,
      handleRemove,
      handleChangeRole,
      handleDeleteInivitationPopup,
      handleResendInivitationPopup
    }
  }
})
</script>
<style scoped>
.role {
  white-space: nowrap;
  display: inline-block;
}
</style>
