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
                <v-img v-if="people.avatar" class="img--rounded" :src="people.avatar.large" />
                <v-img v-else class="img--rounded" src="@/assets/icons/ask-annna-default-gravatar.png" />
              </v-avatar>
            </v-col>
            <v-col :class="[people.avatar ? 'pt-1' : 'pt-0']">
              <v-chip class="role" color="primary"> {{ roleName }} </v-chip>
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
                    <v-list-item-subtitle class="text-subtitle-2">{{ people.job_title }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider />
        <v-card-actions
          v-if="people.status === 'invited' && workspacePeopleInviteRemove"
          :class="{ 'pb-0': isCurrentUserAdmin }"
        >
          <v-row dense class="mx-2">
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
        <v-card-actions v-if="currentUser.short_uuid === people.short_uuid">
          <v-row class="mx-2">
            <v-col>
              <v-btn small block outlined text color="secondary" class="btn--hover" :to="{ name: 'workspace-profile' }">
                Edit my profile
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-actions
          v-if="
            !simple && (workspacePeopleEdit || workspacePeopleRemove) && currentUser.short_uuid !== people.short_uuid
          "
          :class="{ 'pt-0': isCurrentUserAdmin && people.status !== 'accepted' }"
        >
          <v-row dense class="mx-2">
            <v-col v-if="workspacePeopleEdit && buttonsVisible.WA" class="text-center" cols="12">
              <div>
                <v-btn small block outlined text color="secondary" class="btn--hover" @click="handleChangeRole('WA')">
                  MAKE {{ people.name }} A WORKSPACE ADMIN
                </v-btn>
              </div>
            </v-col>
            <v-col v-if="workspacePeopleEdit && buttonsVisible.WM" class="text-center" cols="12">
              <div>
                <v-btn small block outlined text color="secondary" class="btn--hover" @click="handleChangeRole('WM')">
                  MAKE {{ people.name }} A WORKSPACE MEMBER
                </v-btn>
              </div>
            </v-col>
            <v-col v-if="workspacePeopleEdit && buttonsVisible.WV" class="text-center" cols="12">
              <div>
                <v-btn small block outlined text color="secondary" class="btn--hover" @click="handleChangeRole('WV')">
                  MAKE {{ people.name }} A WORKSPACE VIEWER
                </v-btn>
              </div>
            </v-col>
            <v-col class="text-center" cols="12" v-if="people.status === 'accepted' && workspacePeopleRemove">
              <div :class="{ 'mt-2': people.status === 'accepted' }">
                <v-btn small block outlined text color="error" class="btn--hover" max-width="340" @click="handleRemove">
                  Remove&nbsp;{{ name }}
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
import usePermission from '@/core/composition/usePermission'
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
          role: {
            name: '',
            code: ''
          },
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
  },
  setup(props, context) {
    const dialog = ref(false)
    const slicedText = useSlicedText()
    const permission = usePermission()

    const openVmodel = computed({
      get: () => props.value,
      set: value => context.emit('handleValue', value)
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

    const name = computed(() => slicedText(props.people.name || props.people.email, 30))

    const colorBtn = computed(() => (props.isPeopleAdmin ? 'error' : 'secondary'))

    const isCurrentUserAdmin = computed(() => props.currentUser.role.code === 'WA')

    const handleRemove = value => context.emit('onRemovePeople', value)
    const handleChangeRole = value => context.emit('onChangeRole', value)
    const handleDeleteInivitationPopup = () => context.emit('onDeleteInivitationPopup')
    const handleResendInivitationPopup = () => context.emit('onResendInivitationPopup')

    return {
      name,
      dialog,
      roleName,
      colorBtn,
      openVmodel,
      buttonsVisible,
      workspacePeopleEdit,
      workspacePeopleRemove,
      workspacePeopleInviteRemove,

      handleRemove,
      handleChangeRole,
      isCurrentUserAdmin,
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
