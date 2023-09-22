<template>
  <AskAnnaBreadcrumbs :items="breadcrumbs" />
  <div class="px-0 sm:px-2 mb-3">
    <AskAnnaCard
      class="mx-auto"
      :variant="!$vuetify.display.xs ? 'outlined' : 'flat'"
    >
      <AskAnnaCardTitle class="pt-5">
        <AskAnnaAvatar
          v-if="workspaceProfile.avatar.small"
          :size="40"
          class="mr-2"
          rounded="35"
        >
          <VImg
            class="img--rounded"
            :src="workspaceProfile.avatar.small"
          />
        </AskAnnaAvatar>
        <AskAnnaIcon
          v-else
          size="large"
          icon="mdi-account"
        />
        <span class="text-h6 py-1">Edit my profile</span>
      </AskAnnaCardTitle>

      <AskAnnaLoadingProgress :loading="loading">
        <VForm ref="profileForm">
          <AskAnnaCardSubTitle class="text-lg pl-4">Login information</AskAnnaCardSubTitle>
          <UserProfile
            class="px-4 pt-2"
            :error="errors"
            :userProfile="userStore.userProfile"
            @onUpdateUserProfile="handleOnUpdateUserProfile"
          />

          <VTabs
            v-model="currentTab"
            class="px-4"
            color="primary"
          >
            <VTab
              ripple
              key="workspace"
            >Workspace profile</VTab>
            <VTab
              ripple
              key="global"
            >AskAnna profile</VTab>
          </VTabs>

          <VWindow
            v-model="currentTab"
            class="px-4"
          >
            <VWindowItem key="workspace">
              <AskAnnaCardSubTitle class="pt-3 pb-2 ">
                <p class="truncate text-ellipsis">Workspace: {{ workspaceName }}</p>
              </AskAnnaCardSubTitle>
              <AskAnnaCardSubTitle class="pb-3">My role: {{ roleName }}</AskAnnaCardSubTitle>

              <div class="flex items-center">
                <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12 ">
                  <AskAnnaCheckbox
                    class="-ml-1"
                    v-model="useAskAnnaProfile"
                    label="Use AskAnna profile"
                    :hide-details="useAskAnnaProfile"
                    @change="handleChangeUseAskAnnaProfile"
                  />
                </div>
              </div>

              <template v-if="!useAskAnnaProfile">
                <WorkspaceUserProfile
                  :editMode="!useAskAnnaProfile"
                  :workspaceProfile="workspaceProfile"
                  @onUpdateWorkSpaceProfile="handleOnUpdateWorkSpaceProfile"
                />

                <AskAnnaCardSubTitle class="text-lg pb-4">Profile image</AskAnnaCardSubTitle>
                <WorkspaceUserProfileAvatar
                  :editMode="!useAskAnnaProfile"
                  :workspaceProfile="workspaceProfile"
                  @onChangeAvatar="handleOnChangeAvatar"
                />
              </template>
              <AskAnnaCard
                flat
                v-if="useAskAnnaProfile"
              >
                <span
                  class="text-primary cursor-pointer"
                  @click="currentTab = 1"
                >Click here to edit the AskAnna profile</span>
              </AskAnnaCard>
            </VWindowItem>

            <VWindowItem key="global">
              <div class="w-full sm:w-7/12 md:w-4/12 py-3">
                <div>
                  <p>The AskAnna profile is used as the default profile in AskAnna. Read more about this in
                    <a
                      @click.stop
                      target="_blank"
                      class="askanna-link"
                      href="https://docs.askanna.io/account/"
                    >
                      the documentation</a>.
                  </p>
                </div>
              </div>
              <div class="pt-3">
                <WorkspaceUserProfile
                  :editMode="true"
                  :workspaceProfile="userStore.globalProfile"
                  @onUpdateWorkSpaceProfile="handleOnUpdateGlobalProfile"
                />
              </div>
              <AskAnnaCardSubTitle class="text-lg pb-4">Profile image</AskAnnaCardSubTitle>
              <WorkspaceUserProfileAvatar
                :editMode="true"
                :workspaceProfile="userStore.globalProfile"
                @onChangeAvatar="handleOnChangeGlobalAvatar"
              />
            </VWindowItem>
          </VWindow>
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
const peopleStore = usePeopleStore()
const workSpaceStore = useWorkspaceStore()
const imageUrlToBase64 = useImageUrlToBase64()
const { route, router, routerPush } = useRouterAskAnna()

const profileForm = ref(null)
const currentTab = ref('workspace')

const roleFilters = {
  WA: 'Workspace admin',
  WM: 'Workspace member',
  WV: 'Workspace viewer'
}

let errors = reactive({
  name: '',
  email: '',
  password: '',
  old_password: ''
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

const workspaceProfile = computed(() => peopleStore.currentPeople)
const workspaceName = computed(() => workSpaceStore.workspace.name)
const useAskAnnaProfile = computed({
  get: () => workspaceProfile.value.use_global_profile,
  set: use_global_profile => (workspaceProfile.value.use_global_profile = use_global_profile || false)
})

const loading = computed(() => !workspaceProfile.value.email)
const roleName = computed(() => roleFilters[workspaceProfile.value.role.code])

const breadcrumbs = computed(() => [
  {
    title: workSpaceStore.workspace.name,
    to: `/${workSpaceStore.workspace.suuid}`,
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
  let userData, globalData, workspaceData

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

  if (state.isUseAskAnnaProfileChanged) {
    workspaceData = await peopleStore.updateWorkspaceProfile({
      params: route.query,
      data: { use_global_profile: useAskAnnaProfile.value }
    })
    if (!workspaceData || !workspaceData.suuid) {
      isSuccess = false
    }
  }

  if (state.isWorkspaceDataChanged) {
    workspaceData = await peopleStore.updateWorkspaceProfile({
      params: route.query,
      data: {
        ...state.workspaceData,
        use_global_profile: useAskAnnaProfile.value
      }
    })
    if (!workspaceData || !workspaceData.suuid) {
      isSuccess = false
    }
  }

  if (state.isWorkspaceAvatarChanged) {
    const result = await peopleStore.setPeopleAvatar({
      avatar: state.avatar
    })

    isSuccess = result?.status == 204
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
      timeout: 5000,
      color: 'success',
      message: 'Your changes are saved successfully'
    })
    router.go(-1)

    userStore.getGlobalProfile()
    peopleStore.getCurrentPeople({ workspaceId: workSpaceStore.workspace.suuid })
  } else {
    snackBar.showSnackBar({
      timeout: 5000,
      color: 'failed',
      message: 'Something went wrong with saving your changes'
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

const resetError = () => Object.assign(errors, { name: '', email: '', password: '', old_password: '' })

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
      'askanna-workspace-profile-gravatar'
    )

    state.workspaceData = {
      name,
      job_title
    }
  }
}

watch(state, _ => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(errors).some(item => item.length)) {
    resetError()
  }
})
</script>