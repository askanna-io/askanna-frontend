<template>
  <v-form
    lazy-validation
    ref="loginFormRef"
    v-model="isFormValid"
    @submit="handleLogin"
    @keyup.native.enter="handleLogin"
  >
    <v-text-field
      dense
      outlined
      label="Name"
      validate-on-blur
      :value="formData.name"
      @blur="handleOnBlurName"
      :error-messages="error.name"
    />
    <v-text-field
      dense
      outlined
      label="Email"
      v-model="formData.email"
      validate-on-blur
      :error-messages="error.email || error.username"
      :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
    />
    <v-text-field
      dense
      counter
      outlined
      validate-on-blur
      label="Password"
      v-model="formData.password"
      :error-messages="error.password"
      :type="isShowPassword ? 'text' : 'password'"
      :rules="[
        RULES.required('The password is required'),
        RULES.min('The password should be longer than 10 characters', 10)
      ]"
      @click:append="isShowPassword = !isShowPassword"
    />
    <v-text-field
      dense
      outlined
      validate-on-blur
      v-model="formData.workspace"
      label="Workspace name"
      :error-messages="error.workspace"
      :rules="[RULES.required('The workspace name is required')]"
    />

    <v-checkbox
      dense
      class="pt-0 mt-0"
      v-model="formData.terms_of_use"
      :rules="[RULES.required('The Terms of Use and Data Processing Agreement is required')]"
      :error-messages="error.terms_of_use"
    >
      <template v-slot:label>
        <div>
          I accept the
          <a class="ask-anna-link" target="_blank" href="https://askanna.io/terms/" @click.stop> Terms of Use </a>
          and
          <a class="ask-anna-link" target="_blank" href="https://askanna.io/dpa/" @click.stop>
            Data Processing Agreement
          </a>
        </div>
      </template>
    </v-checkbox>

    <input type="password" style="display: none" browserAutocomplete="new-password" autocomplete="new-password" />
    <v-btn :disabled="!isFormValid" :loading="loading" color="primary" class="mr-4" @click="handleLogin">
      Create your account
      <template v-slot:loader>
        <span>{{ loadingText }}...</span>
        <v-icon class="ask-anna-btn-loader" dark> mdi-loading </v-icon>
      </template>
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/useAuthStore'
import useValidationRules from '@/core/composition/useValidationRules'
import { ref, watch, toRefs, inject, reactive, computed } from '@vue/composition-api'

const authStore = useAuthStore()
const { RULES } = useValidationRules()

const updateAuthData = inject('updateAuthData')
const updateSignUpStep = inject('updateSignUpStep')

const loading = ref(false)
const isFormValid = ref(false)
const loginFormRef = ref(null)
const isShowPassword = ref(false)

const formData = reactive({
  name: '',
  email: '',
  username: '',
  password: '',
  workspace: '',
  terms_of_use: false
})

const loadingTexts = ['Creating accout', 'Creating workspace']
const loadingText = computed(() => loadingTexts[authStore.signUpStep])
let error = reactive({ name: '', email: '', username: '', password: '', workspace: '', terms_of_use: '' })

const handleOnBlurName = $e => {
  if (formData.workspace === '' || formData.workspace === formData.name) {
    formData.workspace = $e?.target?.value
  }
  formData.name = $e?.target?.value
}

const handleLogin = async () => {
  updateSignUpStep(0)
  if (!loginFormRef.value.validate()) {
    return
  }
  loading.value = true

  const username = formData.email
  const name = formData.name || undefined
  const workspace = formData.workspace || formData.name
  const account = await authStore.createAccount({
    ...formData,
    name,
    username,
    workspace,
    front_end_domain: window.location.origin
  })

  if (account && account.response && account.response.status === 400) {
    error = { ...error, ...account.response.data }

    loading.value = false

    return
  }
  updateAuthData({ username, password: formData.password })
  updateSignUpStep(1)
}

const resetError = () => {
  error = { name: '', email: '', username: '', password: '', workspace: '', terms_of_use: '' }
}

watch(formData, _ => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(error).some(item => item.length)) {
    resetError()
    loginFormRef.value.resetValidation()
  }
})
</script>
