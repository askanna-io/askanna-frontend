<template>
  <AskAnnaCard class="mx-auto" :outlined="!$vuetify.breakpoint.xsOnly" :flat="$vuetify.breakpoint.xsOnly">
    <div class="askAnna-breadcrumbs">
      <VBreadcrumbs :items="breadcrumbs" :class="{ 'pa-0 pl-3': $vuetify.breakpoint.xsOnly }">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" exact>
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </div>
    <AskAnnaDivider v-if="!$vuetify.breakpoint.xsOnly" />
    <AskAnnaCardTitle>
      <AskAnnaAvatar v-if="workspaceProfile.membership.avatar.small" class="ma-2" rounded="35" :size="35" tile>
        <VImg class="img--rounded" :src="workspaceProfile.membership.avatar.small" />
      </AskAnnaAvatar>
      <AskAnnaIcon v-else large left> mdi-account </AskAnnaIcon>
      <span class="title py-1">Edit my profile</span>
    </AskAnnaCardTitle>

    <AskAnnaLoadingProgress :loading="loading">
      <VForm ref="profileForm">
        <AskAnnaCardTitle class="title py-1">Login information</AskAnnaCardTitle>
        <UserProfile
          :error="errors"
          :userProfile="userStore.userProfile"
          @onUpdateUserProfile="handleOnUpdateUserProfile"
        />

        <VTabs v-model="currentTab" class="pl-4">
          <VTabsSlider color="primary" />
          <VTab ripple key="workspace"> {{ workspaceName }} workspace</VTab>
          <VTab ripple key="global"> AskAnna profile </VTab>
        </VTabs>

        <VTabsItems v-model="currentTab">
          <VTabItem key="workspace">
            <AskAnnaCardSubTitle class="text-body-1">My role: {{ roleName }}</AskAnnaCardSubTitle>

            <AskAnnaContainer fluid class="pb-0">
              <AskAnnaRow dense>
                <AskAnnaCol xs="12" sm="6" md="4" lg="4" xl="3">
                  <AskAnnaCheckbox
                    :hide-details="useAskAnnaProfile"
                    v-model="useAskAnnaProfile"
                    @change="handleChangeUseAskAnnaProfile"
                    class="mt-0"
                    label="Use AskAnna profile"
                  />
                </AskAnnaCol>
              </AskAnnaRow>
            </AskAnnaContainer>
            <template v-if="!useAskAnnaProfile">
              <UserWorkspaceProfile
                :editMode="!useAskAnnaProfile"
                :workspaceProfile="workspaceProfile"
                @onUpdateWorkSpaceProfile="handleOnUpdateWorkSpaceProfile"
              />

              <AskAnnaCardTitle class="text-subtitle-1 py-1">Profile image</AskAnnaCardTitle>
              <UserWorkspaceProfileAvatar
                :editMode="!useAskAnnaProfile"
                :workspaceProfile="workspaceProfile"
                @onChangeAvatar="handleOnChangeAvatar"
              />
            </template>
            <AskAnnaCard flat v-if="useAskAnnaProfile">
              <AskAnnaContainer fluid>
                <AskAnnaRow dense justify="start">
                  <AskAnnaCol xs="12" sm="6" md="4" lg="4" xl="3">
                    <span class="primary--text cursor--pointer" @click="currentTab = 1"
                      >Click here to edit the AskAnna profile</span
                    >
                  </AskAnnaCol></AskAnnaRow
                >
              </AskAnnaContainer>
            </AskAnnaCard>
          </VTabItem>

          <VTabItem key="global">
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
            <UserWorkspaceProfile
              :editMode="true"
              :workspaceProfile="userStore.globalProfile"
              @onUpdateWorkSpaceProfile="handleOnUpdateGlobalProfile"
            />

            <AskAnnaCardTitle class="text-subtitle-1 py-1">Profile image</AskAnnaCardTitle>
            <UserWorkspaceProfileAvatar
              :editMode="true"
              :workspaceProfile="userStore.globalProfile"
              @onChangeAvatar="handleOnChangeGlobalAvatar"
            />
          </VTabItem>
        </VTabsItems>

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
      </VForm>
    </AskAnnaLoadingProgress>
  </AskAnnaCard>
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
  if (Object.values(errors).some(item => item.length)) {
    resetError()
  }
})
</script>
