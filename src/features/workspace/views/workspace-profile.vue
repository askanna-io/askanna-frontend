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
      <v-avatar v-if="workspaceProfile.membership.avatar.small" class="ma-2" rounded="35" :size="35" tile>
        <v-img class="img--rounded" :src="workspaceProfile.membership.avatar.small" />
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

        <v-tabs v-model="currentTab" class="pl-4">
          <v-tabs-slider color="primary" />
          <v-tab ripple key="workspace"> {{ workspaceName }} workspace</v-tab>
          <v-tab ripple key="global"> AskAnna profile </v-tab>
        </v-tabs>

        <v-tabs-items v-model="currentTab">
          <v-tab-item key="workspace">
            <v-card-subtitle class="text-body-1">My role: {{ roleName }}</v-card-subtitle>

            <v-container fluid class="pb-0">
              <v-row dense>
                <v-col xs="12" sm="6" md="4" lg="4" xl="3">
                  <v-checkbox
                    :hide-details="useAskAnnaProfile"
                    v-model="useAskAnnaProfile"
                    @change="handleChangeUseAskAnnaProfile"
                    label="Use AskAnna profile"
                    class="mt-0"
                  />
                </v-col>
              </v-row>
            </v-container>
            <template v-if="!useAskAnnaProfile">
              <user-workspace-profile
                :editMode="!useAskAnnaProfile"
                :workspaceProfile="workspaceProfile"
                @onUpdateWorkSpaceProfile="handleOnUpdateWorkSpaceProfile"
              />

              <v-card-title class="text-subtitle-1 py-1">Profile image</v-card-title>
              <user-workspace-profile-avatar
                :editMode="!useAskAnnaProfile"
                :workspaceProfile="workspaceProfile"
                @onChangeAvatar="handleOnChangeAvatar"
              />
            </template>
            <v-card flat v-if="useAskAnnaProfile">
              <v-container fluid>
                <v-row dense justify="start">
                  <v-col xs="12" sm="6" md="4" lg="4" xl="3">
                    <span class="primary--text cursor--pointer" @click="currentTab = 1"
                      >Click here to edit the AskAnna profile</span
                    >
                  </v-col></v-row
                >
              </v-container>
            </v-card>
          </v-tab-item>

          <v-tab-item key="global">
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
          </v-tab-item>
        </v-tabs-items>

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
import useImageUrlToBase64 from '@/core/composition/useImageUrlToBase64'
import UserProfile from '@/features/user/components/profile/UserProfile.vue'
import useWorkSpaceStore from '@/features/workspace/composition/useWorkSpaceStore'
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
    const workSpaceStore = useWorkSpaceStore()
    const imageUrlToBase64 = useImageUrlToBase64()

    const profileForm = ref(null)
    const currentTab = ref('workspace')

    const roleFilters = {
      WA: 'Workspace admin',
      WM: 'Workspace member',
      WV: 'Workspace viewer'
    }

    const errors = reactive({
      userDataError: { email: '', password: '', old_password: '' }
    })

    const state = reactive({
      avatar: '',
      userData: {},
      globalData: {},
      globalAvatar: '',
      workspaceData: {},
      isUserDataEdited: false,
      isGlobalDataChanged: false,
      isGlobalAvatarChanged: false,
      isWorkspaceDataChanged: false,
      isWorkspaceAvatarChanged: false,
      isUseAskAnnaProfileChanged: false
    })

    const isSaveDisabled = computed(
      () =>
        !state.isUserDataEdited &&
        !state.isGlobalDataChanged &&
        !state.isGlobalAvatarChanged &&
        !state.isWorkspaceDataChanged &&
        !state.isWorkspaceAvatarChanged &&
        !state.isUseAskAnnaProfileChanged
    )

    const userProfile = computed(() => userStore.state.userProfile.value)
    const globalProfile = computed(() => userStore.state.globalProfile.value)

    const workspaceName = computed(() => workSpaceStore.workspace.value.name)
    const workspaceProfile = computed(() => workSpaceStore.state.currentPeople.value)
    const useAskAnnaProfile = computed({
      get: () => {
        return workspaceProfile.value.use_global_profile
      },
      set: use_global_profile => {
        workSpaceStore.mutations.SET_CURRENT_PEOPLE({
          use_global_profile
        })
      }
    })

    const loading = computed(() => !workspaceProfile.value.email)
    const roleName = computed(() => roleFilters[workspaceProfile.value.role.code])

    const breadcrumbs = computed(() => [
      {
        title: workSpaceStore.workspace.value.name,
        to: `/${workSpaceStore.workspace.value.short_uuid}`,
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
      let userData, globalData, workspaceData

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

      if (state.isUseAskAnnaProfileChanged) {
        workspaceData = await workSpaceStore.actions.updateWorkspaceProfile({
          use_global_profile: useAskAnnaProfile.value
        })
        if (!workspaceData || !workspaceData.short_uuid) {
          isSuccess = false
        }
      }

      if (state.isWorkspaceDataChanged) {
        workspaceData = await workSpaceStore.actions.updateWorkspaceProfile({
          ...state.workspaceData,
          use_global_profile: useAskAnnaProfile.value
        })
        if (!workspaceData || !workspaceData.short_uuid) {
          isSuccess = false
        }
      }

      if (state.isWorkspaceAvatarChanged) {
        const result = await workSpaceStore.actions.setPeopleAvatar({
          avatar: state.avatar
        })

        if (!result || !result.short_uuid) {
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
        workSpaceStore.actions.getCurrentPeople({ workspaceId: workSpaceStore.workspace.value.short_uuid })
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
      state.isUserDataEdited = true
      state.userData = { ...state.userData, ...data }
    }

    const handleOnUpdateWorkSpaceProfile = data => {
      state.isWorkspaceDataChanged = true
      state.workspaceData = { ...state.workspaceData, ...data }
    }

    const handleOnUpdateGlobalProfile = data => {
      state.isGlobalDataChanged = true
      state.globalData = { ...state.globalData, ...data }
    }

    const resetError = () => {
      errors.userDataError = { name: '', email: '', username: '', password: '' }
    }

    const handleOnChangeAvatar = data => {
      state.avatar = data
      state.isWorkspaceAvatarChanged = true
    }

    const handleOnChangeGlobalAvatar = data => {
      state.globalAvatar = data
      state.isGlobalAvatarChanged = true
    }

    const handleChangeUseAskAnnaProfile = async value => {
      state.isUseAskAnnaProfileChanged = true
      if (!value) {
        const { name, job_title, avatar } = workspaceProfile.value

        imageUrlToBase64.convertUrlToBase64(
          avatar.large,
          ({ result }) => {
            state.avatar = result
          },
          'ask-annna-workspace-profile-gravatar'
        )

        state.workspaceData = {
          name,
          job_title
        }
      }
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
      roleName,
      currentTab,
      profileForm,
      breadcrumbs,
      userProfile,
      globalProfile,
      workspaceName,
      isSaveDisabled,
      workspaceProfile,
      useAskAnnaProfile,

      handleSave,
      handleCancel,
      handleOnChangeAvatar,
      handleOnUpdateUserProfile,
      handleOnChangeGlobalAvatar,
      handleOnUpdateGlobalProfile,
      handleChangeUseAskAnnaProfile,
      handleOnUpdateWorkSpaceProfile
    }
  }
})
</script>
