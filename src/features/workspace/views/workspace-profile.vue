<template>
  <v-card class="mx-auto" outlined>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" exact>
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-divider />
    <v-card-title>
      <v-icon large left>
        mdi-account
      </v-icon>
      <span class="title py-1">Edit your profile</span>
    </v-card-title>
    <ask-anna-loading-progress :loading="loading">
      <v-form ref="profileForm">
        <v-card-title class="title py-1">Login information</v-card-title>
        <user-profile
          :error="userDataError"
          :userProfile="userProfile"
          @onUpdateUserProfile="handleOnUpdateUserProfile"
        />

        <v-card-title class="title py-1">{{ workspaceTitle }} workspace</v-card-title>
        <user-workspace-profile
          :workspaceProfile="workspaceProfile"
          @onUpdateWorkSpaceProfile="handleOnUpdateWorkSpaceProfile"
        />

        <v-card-title class="text-subtitle-1 py-1">Profile image</v-card-title>
        <user-workspace-profile-avatar @onChangeAvatar="handleOnChangeAvatar" :workspaceProfile="workspaceProfile" />

        <v-btn
          text
          small
          outlined
          color="secondary"
          @click="handleSave"
          class="ma-2 btn--hover"
          :disabled="isSaveDisabled"
        >
          Save my changes
        </v-btn>
        <v-btn small outlined text color="secondary" class="ma-2 btn--hover" @click="handleCancel">
          Cancel
        </v-btn>
      </v-form>
    </ask-anna-loading-progress>
  </v-card>
</template>

<script>
import useBreadcrumbs from '@/core/composition/useBreadcrumbs'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import UserProfile from '@/features/user/components/profile/UserProfile'

import useUserStore from '@/features/user/composition/useUserStore'
import useWorkSpaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import UserWorkspaceProfile from '@/features/workspace/components/profile/UserWorkspaceProfile'
import UserWorkspaceProfileAvatar from '@/features/workspace/components/profile/UserWorkspaceProfileAvatar'

import { watch, ref, toRefs, reactive, computed, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'workspace-profile',

  components: { UserProfile, UserWorkspaceProfile, UserWorkspaceProfileAvatar },

  setup(props, context) {
    const snackBar = useSnackBar()
    const userStore = useUserStore()
    const workSpaceStore = useWorkSpaceStore(context)

    const profileForm = ref(null)

    const errors = reactive({
      userDataError: { email: '', password: '', old_password: '' }
    })

    const state = reactive({
      avatar: '',
      userData: {},
      workspaceData: {},
      isUserDataEdited: false,
      isWorkspaceDataChanged: false,
      isWorkspaceAvatarChanged: false
    })

    const resetState = async () => {
      state.avatar = ''
      state.userData = {}
      state.workspaceData = {}
      state.isUserDataEdited = false
      state.isWorkspaceDataChanged = false
      state.isWorkspaceAvatarChanged = false

      userStore.mutations.DELETE_PASSWORD()
    }

    const isSaveDisabled = computed(
      () => !state.isUserDataEdited && !state.isWorkspaceDataChanged && !state.isWorkspaceAvatarChanged
    )

    const userProfile = computed(() => userStore.state.userProfile.value)
    const workspaceTitle = computed(() => workSpaceStore.workspace.value.title)
    const workspaceProfile = computed(() => workSpaceStore.state.currentPeople.value)

    const loading = computed(() => !workspaceProfile.value.email)

    const breadcrumbs = computed(() => [
      {
        title: workSpaceStore.workspace.value.title,
        to: `/${workSpaceStore.workspace.value.short_uuid}`,
        disabled: false
      },
      {
        title: 'Profile',
        to: '',
        disabled: true
      }
    ])

    const reset = () => profileForm.value.reset()
    const resetValidation = () => profileForm.value.resetValidation()

    const handleSave = async () => {
      let isSuccess1 = false
      let isSuccess2 = false

      let userData,
        workspaceData,
        succesMessage,
        succesMessage1,
        succesMessage2,
        failedMessage,
        failedMessage1,
        failedMessage2

      if (state.isUserDataEdited) {
        userData = await userStore.actions.updateProfile({
          data: state.userData,
          uuid: userProfile.value.short_uuid
        })

        if (userData && userData.response && userData.response.status === 400) {
          errors.userDataError = { ...errors.userDataError, ...userData.response.data }
          failedMessage1 = 'login information'
        } else {
          isSuccess1 = true
          succesMessage1 = userData?.short_uuid && 'login information'
        }
      }

      if (state.isWorkspaceDataChanged) {
        workspaceData = await workSpaceStore.actions.updateWorkspaceProfile(state.workspaceData)
        if (workspaceData && workspaceData.short_uuid) {
          isSuccess2 = true
          succesMessage2 = workspaceData?.short_uuid && 'workspace profile'
        } else {
          failedMessage2 = 'workspace profile'
        }
      }

      if (state.isWorkspaceAvatarChanged) {
        const result = await workSpaceStore.actions.setPeopleAvatar({
          avatar: `data:*/*;base64, ${state.avatar}`
        })

        if (result) {
          isSuccess2 = true
          succesMessage2 = 'workspace profile'
        } else {
          failedMessage2 = 'workspace profile'
        }
      }

      succesMessage = succesMessage1 && succesMessage2 && `login information and workspace profile`
      failedMessage = failedMessage1 && failedMessage2 && ' login information and workspace profile'

      if ((isSuccess1 || isSuccess2) && !failedMessage1 && !failedMessage2) {
        snackBar.showSnackBar({
          message: `You have successfully updated your ${succesMessage || succesMessage1 || succesMessage2}`,
          color: 'success',
          timeout: 5000
        })

        resetState()
        resetValidation()

        setTimeout(() => context.root.$router.go(-1), 500)
      }

      if (failedMessage1 || failedMessage2) {
        snackBar.showSnackBar({
          message: `Something went wrong while changing your ${failedMessage || failedMessage1 || failedMessage2}`,
          color: 'failed',
          timeout: 5000
        })
      }
    }

    const handleCancel = () => context.root.$router.go(-1)
    const handleOnUpdateUserProfile = data => {
      state.userData = { ...state.userData, ...data }
      state.isUserDataEdited = true
    }
    const handleOnUpdateWorkSpaceProfile = data => {
      state.workspaceData = { ...state.workspaceData, ...data }
      state.isWorkspaceDataChanged = true
    }

    const resetError = () => {
      errors.userDataError = { name: '', email: '', username: '', password: '' }
    }

    const handleOnChangeAvatar = data => {
      state.avatar = data
      state.isWorkspaceAvatarChanged = true
      console.log(state.isWorkspaceAvatarChanged)
    }

    const handleUploadAvatar = async data => {
      const result = await workSpaceStore.actions.setPeopleAvatar({
        avatar: `data:*/*;base64, ${data}`
      })
    }

    watch(state, _ => {
      // check if exist error from backend on typing fields, try resest validation
      if (Object.values(errors.userDataError).some(error => error.length)) {
        resetError()
        resetValidation()
      }
    })

    return {
      ...toRefs(errors),

      loading,
      profileForm,
      breadcrumbs,
      userProfile,
      isSaveDisabled,
      workspaceTitle,
      workspaceProfile,

      handleSave,
      handleCancel,
      handleUploadAvatar,
      handleOnChangeAvatar,
      handleOnUpdateUserProfile,
      handleOnUpdateWorkSpaceProfile
    }
  }
})
</script>
