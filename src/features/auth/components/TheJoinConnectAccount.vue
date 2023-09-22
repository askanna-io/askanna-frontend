<template>
  <VForm
    v-if="!isSuccesLogedIn"
    @submit.prevent
    ref="loginFormRef"
    v-model="isFormValid"
    @keyup.enter="handleLogin"
  >
    <AskAnnaTextField
      v-model="email"
      required
      label="Email"
      class="pb-2"
      validate-on="blur"
      autocomplete="off"
      :error-messages="error.email"
      :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
    />
    <AskAnnaTextField
      counter
      required
      class="pb-2"
      label="Password"
      v-model="password"
      :error-messages="error.password"
      :type="isShowPassword ? 'text' : 'password'"
      :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="isShowPassword = !isShowPassword"
      :rules="[
          RULES.required('The password is required'),
          RULES.min('The password should be longer than 10 characters', 10)
        ]"
    />
    <AskAnnaButton
      type="submit"
      class="mr-4"
      size="default"
      color="primary"
      variant="elevated"
      :loading="loading"
      :loadingText="{ loadingText }"
      @click.stop="handleLogin"
    >
      Sign in, connect and join
    </AskAnnaButton>
  </VForm>
  <TheJoinExistingAccountPopup
    :value="joinExistDialog"
    :workspaceName="workspaceName"
    @changeValue="handleJoinExist"
    @closeDialog="handleCloseDialog"
  />
</template>

<script setup lang="ts">
import { get } from 'lodash'

const authStore = useAuthStore()
const peopleStore = usePeopleStore()
const { RULES } = useValidationRules()
const { route, routerPush } = useRouterAskAnna()

const { token, peopleId, workspaceId, workspaceName } = route.params
const loadingTexts = ['Login on AskAnna', 'Accept invitataion', 'Join to workspace']

const step = ref(0)
const email = ref('')
const password = ref('')
const loading = ref(false)

const loadingText = computed(() => loadingTexts[step.value])

let error = reactive({
  name: '',
  email: '',
  password: ''
})

const loginFormRef = ref(null)
const isFormValid = ref(true)
const isShowPassword = ref(false)
const isSuccesLogedIn = ref(false)
const joinExistDialog = ref(false)

const joinToWorkpase = () => {
  step.value = 2
  setTimeout(() => routerPush({ name: 'workspace', params: { workspaceId } }), 1000)
}

const handleLogin = async () => {
  step.value = 0
  const { valid } = await loginFormRef.value.validate()

  if (!valid) {
    isFormValid.value = false
    return
  }

  let result = null
  loading.value = true

  const auth = await authStore.login({
    email: email.value,
    password: password.value
  })

  if (auth && auth.key) {
    step.value = 1

    result = await peopleStore.acceptInvitetion({
      token,
      peopleId,
      workspaceId
    })
  }

  if (result && auth.response && auth.response.status === 400) {
    Object.assign(error, auth.response.data)

    return
  }

  if (result && result.status == 204) {
    joinToWorkpase()

    return
  }

  if (get(result, 'response.status') === 400) {
    if (get(result, 'response.data.user[0]') === 'User is already part of this membership') {
      joinExistDialog.value = true
    }
  }

  loading.value = false
}

const handleJoinExist = val => {
  joinExistDialog.value = val
  if (val) {
    joinToWorkpase()
  }
}
const handleCloseDialog = () => (joinExistDialog.value = false)
</script>