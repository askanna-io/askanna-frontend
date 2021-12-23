<template>
  <v-card class="mx-auto" :outlined="!$vuetify.breakpoint.xsOnly" :flat="$vuetify.breakpoint.xsOnly">
    <div class="askAnna-breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" :class="{ 'pa-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>

    <v-divider v-if="!$vuetify.breakpoint.xsOnly" />
    <v-card-title>
      <v-avatar v-if="globalProfile.avatar.small" class="ma-2" rounded="35" :size="35" tile>
        <v-img class="img--rounded" :src="globalProfile.avatar.small" />
      </v-avatar>
      <v-icon v-else large left> mdi-account </v-icon>
      <span class="title py-1">Edit my profile</span>
    </v-card-title>
    <ask-anna-loading-progress :loading="loading">
      <v-form ref="profileForm">
        <v-card-title class="title py-1">Login information</v-card-title>
        <user-profile
          :error="userDataError"
          :userProfile="userProfile"
          @onUpdateUserProfile="handleOnUpdateUserProfile"
        />

        <v-card-title class="title py-1">AskAnna profile</v-card-title>

        <v-container fluid>
          <v-row dense>
            <v-col xs="12" sm="6" md="4" lg="4" xl="3">
              The AskAnna profile is used as the default profile in AskAnna. Read more about this in
              <a class="ask-anna-link" target="_blank" href="https://docs.askanna.io/account/" @click.stop>
                the documentation</a
              >.
            </v-col>
          </v-row>
        </v-container>
        <user-workspace-profile
          :editMode="true"
          :workspaceProfile="globalProfile"
          @onUpdateWorkSpaceProfile="handleOnUpdateGlobalProfile"
        />

        <v-card-title class="text-subtitle-1 py-1">Profile image</v-card-title>
        <user-workspace-profile-avatar
          :editMode="true"
          :workspaceProfile="globalProfile"
          @onChangeAvatar="handleOnChangeGlobalAvatar"
        />

        <v-container fluid>
          <v-row dense justify="start">
            <v-col xs="12" sm="6" md="2" lg="2">
              <v-btn
                text
                block
                small
                outlined
                color="secondary"
                @click="handleSave"
                class="btn--hover"
                :disabled="isSaveDisabled"
              >
                Save my changes
              </v-btn>
            </v-col>
            <v-col xs="12" sm="6" md="2" lg="2">
              <v-btn small block outlined text color="secondary" class="btn--hover" @click="handleCancel">
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </ask-anna-loading-progress>
  </v-card>
</template>

<script lang="ts">
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useUserStore from '@/features/user/composition/useUserStore'
import UserProfile from '@/features/user/components/profile/UserProfile.vue'
import { watch, ref, toRefs, reactive, computed, defineComponent } from '@vue/composition-api'
import UserWorkspaceProfile from '@/features/workspace/components/profile/UserWorkspaceProfile.vue'
import UserWorkspaceProfileAvatar from '@/features/workspace/components/profile/UserWorkspaceProfileAvatar.vue'

export default defineComponent({
  name: 'workspace-profile',

  components: { UserProfile, UserWorkspaceProfile, UserWorkspaceProfileAvatar },

  setup(_, context) {
    const snackBar = useSnackBar()
    const userStore = useUserStore()
    const router = useRouterAskAnna()

    const profileForm = ref(null)
    const currentTab = ref('workspace')

    const errors = reactive({
      userDataError: { email: '', password: '', old_password: '' }
    })

    const state = reactive({
      avatar: '',
      userData: {},
      globalData: {},
      globalAvatar: '',
      isUserDataEdited: false,
      isGlobalDataChanged: false,
      isGlobalAvatarChanged: false
    })

    const isSaveDisabled = computed(
      () => !state.isUserDataEdited && !state.isGlobalDataChanged && !state.isGlobalAvatarChanged
    )

    const userProfile = computed(() => userStore.state.userProfile.value)
    const globalProfile = computed(() => userStore.state.globalProfile.value)

    const loading = computed(() => !globalProfile.value.email)

    const breadcrumbs = computed(() => [
      {
        title: 'Home',
        to: `/`,
        disabled: false
      },
      {
        title: 'Edit my profile',
        to: '',
        disabled: true
      }
    ])

    const resetValidation = () => profileForm.value.resetValidation()

    const handleSave = async () => {
      let isSuccess = true
      let userData, globalData

      if (state.isUserDataEdited) {
        userData = await userStore.actions.updateProfile({
          data: state.userData,
          uuid: userProfile.value.short_uuid
        })

        if (userData && userData.response && userData.response.status === 400) {
          errors.userDataError = { ...errors.userDataError, ...userData.response.data }

          isSuccess = false
        }
      }

      if (state.isGlobalDataChanged) {
        globalData = await userStore.actions.updateGlobalProfile(state.globalData)
        if (!globalData || !globalData.short_uuid) {
          isSuccess = false
        }
      }

      if (state.isGlobalAvatarChanged) {
        const result = await userStore.actions.updateGlobalAvatar({
          avatar: state.globalAvatar
        })

        if (!result || !result.short_uuid) {
          isSuccess = false
        }
      }

      if (isSuccess) {
        snackBar.showSnackBar({
          message: 'Your changes are saved successfully',
          color: 'success',
          timeout: 5000
        })
        context.root.$router.go(-1)
        userStore.actions.getGlobalProfile()
      } else {
        snackBar.showSnackBar({
          message: 'Something went wrong with saving your changes',
          color: 'failed',
          timeout: 5000
        })
      }
    }

    const handleCancel = () => {
      if (window.history.length <= 2) {
        router.push({ path: '/' })
      } else {
        context.root.$router.go(-1)
      }
    }

    const handleOnUpdateUserProfile = data => {
      state.userData = { ...state.userData, ...data }
      state.isUserDataEdited = true
    }

    const handleOnUpdateGlobalProfile = data => {
      state.globalData = { ...state.globalData, ...data }
      state.isGlobalDataChanged = true
    }

    const resetError = () => {
      errors.userDataError = { name: '', email: '', username: '', password: '' }
    }

    const handleOnChangeGlobalAvatar = data => {
      state.globalAvatar = data
      state.isGlobalAvatarChanged = true
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
      currentTab,
      profileForm,
      breadcrumbs,
      userProfile,
      globalProfile,
      isSaveDisabled,

      handleSave,
      handleCancel,
      handleOnUpdateUserProfile,
      handleOnChangeGlobalAvatar,
      handleOnUpdateGlobalProfile
    }
  }
})
</script>
