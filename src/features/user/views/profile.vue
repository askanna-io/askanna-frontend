<template>
  <AskAnnaCard class="mx-auto" :outlined="!$vuetify.breakpoint.xsOnly" :flat="$vuetify.breakpoint.xsOnly">
    <div class="askAnna-breadcrumbs">
      <v-breadcrumbs :items="breadcrumbs" :class="{ 'pa-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>

    <AskAnnaDivider v-if="!$vuetify.breakpoint.xsOnly" />
    <AskAnnaCardTitle>
      <AskAnnaAvatar v-if="userStore.globalProfile.avatar.small" class="ma-2" rounded="35" :size="35" tile>
        <v-img class="img--rounded" :src="userStore.globalProfile.avatar.small" />
      </AskAnnaAvatar>
      <AskAnnaIcon v-else large left> mdi-account </AskAnnaIcon>
      <span class="title py-1">Edit my profile</span>
    </AskAnnaCardTitle>
    <AskAnnaLoadingProgress :loading="loading">
      <v-form ref="profileForm">
        <AskAnnaCardTitle class="title py-1">Login information</AskAnnaCardTitle>
        <UserProfile
          :error="errors"
          :userProfile="userStore.userProfile"
          @onUpdateUserProfile="handleOnUpdateUserProfile"
        />

        <AskAnnaCardTitle class="title py-1">AskAnna profile</AskAnnaCardTitle>

        <AskAnnaContainer fluid>
          <AskAnnaRow dense>
            <AskAnnaCol xs="12" sm="6" md="4" lg="4" xl="3">
              The AskAnna profile is used as the default profile in AskAnna. Read more about this in
              <a class="ask-anna-link" target="_blank" href="https://docs.askanna.io/account/" @click.stop>
                the documentation</a
              >.
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaContainer>
        <user-workspace-profile
          :editMode="true"
          :workspaceProfile="userStore.globalProfile"
          @onUpdateWorkSpaceProfile="handleOnUpdateGlobalProfile"
        />

        <AskAnnaCardTitle class="text-subtitle-1 py-1">Profile image</AskAnnaCardTitle>
        <user-workspace-profile-avatar
          :editMode="true"
          :workspaceProfile="userStore.globalProfile"
          @onChangeAvatar="handleOnChangeGlobalAvatar"
        />

        <AskAnnaContainer fluid>
          <AskAnnaRow dense justify="start">
            <AskAnnaCol xs="12" sm="6" md="2" lg="2">
              <AskAnnaButton
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
              </AskAnnaButton>
            </AskAnnaCol>
            <AskAnnaCol xs="12" sm="6" md="2" lg="2">
              <AskAnnaButton small block outlined text color="secondary" class="btn--hover" @click="handleCancel">
                Cancel
              </AskAnnaButton>
            </AskAnnaCol>
          </AskAnnaRow>
        </AskAnnaContainer>
      </v-form>
    </AskAnnaLoadingProgress>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const snackBar = useSnackBar()
const userStore = useUserStore()
const { router } = useRouterAskAnna()

const profileForm = ref(null)

let errors = reactive({ name: '', email: '', password: '', username: '', old_password: '' })

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

const loading = computed(() => !userStore.globalProfile.email)

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
    userData = await userStore.updateProfile({
      data: state.userData,
      uuid: userStore.userProfile.short_uuid
    })

    if (userData && userData.response && userData.response.status === 400) {
      errors = { ...errors, ...userData.response.data }

      isSuccess = false
    }
  }

  if (state.isGlobalDataChanged) {
    globalData = await userStore.updateGlobalProfile(state.globalData)
    if (!globalData || !globalData.short_uuid) {
      isSuccess = false
    }
  }

  if (state.isGlobalAvatarChanged) {
    const result = await userStore.updateGlobalAvatar({
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
    router.go(-1)
    userStore.getGlobalProfile()
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
    router.go(-1)
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
  errors = { name: '', email: '', username: '', password: '', old_password: '' }
}

const handleOnChangeGlobalAvatar = data => {
  state.globalAvatar = data
  state.isGlobalAvatarChanged = true
}

watch(state, _ => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(errors).some(item => item.length)) {
    resetError()
    resetValidation()
  }
})
</script>
