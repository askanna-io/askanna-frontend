<template>
  <div>
    <v-form
      v-if="!isSuccesLogedIn"
      ref="loginFormRef"
      v-model="isFormValid"
      lazy-validation
      @keyup.native.enter="handleLogin"
      @submit.stop="handleLogin"
    >
      <v-text-field
        v-model="username"
        :error-messages="error.email"
        :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
        dense
        outlined
        validate-on-blur
        autocomplete="off"
        label="Email"
        required
      />
      <v-text-field
        dense
        outlined
        v-model="password"
        :error-messages="error.password"
        :rules="[
          RULES.required('The password is required'),
          RULES.min('The password should be longer than 10 characters', 10)
        ]"
        :append-icon="isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
        :type="isShowPassword ? 'text' : 'password'"
        name="input-10-1"
        label="Password"
        counter
        @click:append="isShowPassword = !isShowPassword"
      />
      <input type="password" style="display: none" browserAutocomplete="new-password" autocomplete="new-password" />
      <v-btn :disabled="!isFormValid" :loading="loading" color="primary" class="mr-4" @click.stop="handleLogin">
        Sign in, connect and join
        <template v-slot:loader>
          <span>{{ loadingText }}...</span>
          <v-icon class="ask-anna-btn-loader" dark> mdi-loading </v-icon>
        </template>
      </v-btn>
    </v-form>
    <JoinExistingAccountPopup
      :value="joinExistDialog"
      :workspaceName="workspaceName"
      @changeValue="handleJoinExist"
      @closeDialog="handleCloseDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { get } from 'lodash'

const authStore = useAuthStore()
const peopleStore = usePeopleStore()
const { RULES } = useValidationRules()
const { route, router } = useRouterAskAnna()

const { token, peopleId, workspaceId, workspaceName } = route.params
const loadingTexts = ['Login on AskAnna', 'Accept invitataion', 'Join to workspace']

const step = ref(0)
const username = ref('')
const password = ref('')
const loading = ref(false)

const loadingText = computed(() => loadingTexts[step.value])

let error = reactive({
  name: '',
  email: '',
  username: '',
  password: ''
})

const loginFormRef = ref(null)
const isFormValid = ref(false)
const isShowPassword = ref(false)
const isSuccesLogedIn = ref(false)
const joinExistDialog = ref(false)

const joinToWorkpase = () => {
  step.value = 2
  setTimeout(() => router.push({ name: 'workspace', params: { workspaceId } }), 1000)
}

const handleLogin = async () => {
  step.value = 0
  if (!loginFormRef.value.validate()) {
    return
  }

  let result = null
  loading.value = true

  const auth = await authStore.login({
    redirect: false,
    username: username.value,
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
    loading.value = false

    error = { ...error, ...auth.response.data }

    return
  }

  if (result && result.status === 'accepted') {
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