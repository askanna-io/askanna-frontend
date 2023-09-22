<template>
  <AskAnnaBreadcrumbs :items="breadcrumbs" />

  <div class="px-0 sm:px-2 mb-3">
    <AskAnnaCard
      class="mx-auto"
      :variant="!$vuetify.display.xs ? 'outlined' : 'default'"
    >
      <AskAnnaCardTitle class="pt-5">
        <AskAnnaAvatar
          v-if="userStore.globalProfile.avatar.small"
          :size="40"
          class="mr-2"
        >
          <VImg :src="userStore.globalProfile.avatar.small" />
        </AskAnnaAvatar>
        <AskAnnaIcon
          v-else
          large
          left
        > mdi-account </AskAnnaIcon>
        <span class="text-h6 py-1">Edit my profile</span>
      </AskAnnaCardTitle>
      <AskAnnaLoadingProgress :loading="loading">
        <VForm ref="profileForm">
          <AskAnnaCardSubTitle class="text-lg pl-4">Login information</AskAnnaCardSubTitle>

          <div class="px-4 pt-2">
            <UserProfile
              :error="errors"
              :userProfile="userStore.userProfile"
              @onUpdateUserProfile="handleOnUpdateUserProfile"
            />
          </div>

          <AskAnnaCardSubTitle class="text-lg pl-4">AskAnna profile</AskAnnaCardSubTitle>

          <div class="flex px-4 mb-3">
            <div class="w-full sm:w-7/12 md:w-4/12 ">
              The AskAnna profile is used as the default profile in AskAnna. Read more about this in
              <a
                @click.stop
                target="_blank"
                class="askanna-link"
                href="https://docs.askanna.io/account/"
              >
                the documentation</a>.
            </div>
          </div>

          <div class="px-4 pt-3">
            <WorkspaceUserProfile
              :editMode="true"
              :workspaceProfile="userStore.globalProfile"
              @onUpdateWorkSpaceProfile="handleOnUpdateGlobalProfile"
            />
          </div>

          <AskAnnaCardSubTitle class="text-lg pl-4 pb-4">Profile image</AskAnnaCardSubTitle>
          <div class="pl-4">
            <WorkspaceUserProfileAvatar
              :editMode="true"
              :workspaceProfile="userStore.globalProfile"
              @onChangeAvatar="handleOnChangeGlobalAvatar"
            />
          </div>
          <div class="w-full sm:w-7/12 md:w-4/12 pl-4 pr-4 sm:pr-0 pt-3 pb-3 mt-3">
            <div class="flex gap-2">
              <AskAnnaButton
                block
                @click="handleSave"
                :disabled="isSaveDisabled"
              >
                Save my changes
              </AskAnnaButton>

              <AskAnnaButton
                block
                @click="handleCancel"
              >
                Cancel
              </AskAnnaButton>
            </div>
          </div>
        </VForm>
      </AskAnnaLoadingProgress>
    </AskAnnaCard>
  </div>
</template>

<script setup lang="ts">
const snackBar = useSnackBar()
const userStore = useUserStore()
const { router, routerPush } = useRouterAskAnna()

const profileForm = ref(null)

let errors = reactive({ name: '', email: '', password: '', old_password: '' })

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

const handleSave = async () => {
  let isSuccess = true
  let userData, globalData

  if (state.isUserDataEdited) {
    userData = await userStore.updateProfile({
      data: state.userData,
      suuid: userStore.userProfile.suuid
    })

    if (userData && userData.response && userData.response.status === 400) {
      errors = { ...errors, ...userData.response.data }

      isSuccess = false
    }
  }

  if (state.isGlobalDataChanged) {
    globalData = await userStore.updateGlobalProfile(state.globalData)
    if (!globalData || !globalData.suuid) {
      isSuccess = false
    }
  }
  if (state.isGlobalAvatarChanged) {
    const result = await userStore.updateGlobalAvatar({
      avatar: state.globalAvatar
    })

    isSuccess = result?.status == 204
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
    routerPush({ path: '/' })
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

const resetError = () => Object.assign(errors, { name: '', email: '', password: '', old_password: '' })

const handleOnChangeGlobalAvatar = data => {
  state.globalAvatar = data
  state.isGlobalAvatarChanged = true
}

watch(state, _ => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(errors).some(item => item.length)) {
    resetError()
  }
})
</script>