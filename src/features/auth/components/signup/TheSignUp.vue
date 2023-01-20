<template>
  <VForm
    lazy-validation
    ref="loginFormRef"
    v-model="isFormValid"
    @submit="handleLogin"
    @keyup.native.enter="handleLogin"
  >
    <AskAnnaTextField
      dense
      outlined
      label="Name"
      validate-on-blur
      :value="formData.name"
      @blur="handleOnBlurName"
      :error-messages="error.name"
      :rules="[RULES.required('The name is required')]"
    />
    <AskAnnaTextField
      dense
      outlined
      label="Email"
      v-model="formData.email"
      validate-on-blur
      @input="handleOnInputEmail"
      :error-messages="error.email"
      :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
    />
    <AskAnnaTextField
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
    <AskAnnaTextField
      dense
      outlined
      validate-on-blur
      v-model="formData.workspace_name"
      label="Workspace name"
      :error-messages="error.workspace_name"
      :rules="[RULES.required('The workspace name is required')]"
    />

    <AskAnnaCheckbox
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
    </AskAnnaCheckbox>

    <input type="password" style="display: none" browserAutocomplete="new-password" autocomplete="new-password" />
    <AskAnnaButton :disabled="!isFormValid" :loading="loading" color="primary" class="mr-4" @click="handleLogin">
      Create your account
      <template v-slot:loader>
        <span>{{ loadingText }}...</span>
        <AskAnnaIcon class="ask-anna-btn-loader" dark>mdi-loading</AskAnnaIcon>
      </template>
    </AskAnnaButton>
  </VForm>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { RULES } = useValidationRules()

const loading = ref(false)
const isFormValid = ref(false)
const loginFormRef = ref(null)
const isShowPassword = ref(false)

const formData = reactive({
  name: '',
  email: '',
  password: '',
  workspace_name: '',
  terms_of_use: false
})

const loadingTexts = ['Creating accout', 'Creating workspace']
const loadingText = computed(() => loadingTexts[authStore.signUpStep])
const error = reactive({ name: '', email: '', password: '', workspace_name: '', terms_of_use: '' })

const handleOnBlurName = $e => {
  if (formData.workspace_name === '' || formData.workspace_name === formData.name) {
    formData.workspace_name = $e?.target?.value
  }
  formData.name = $e?.target?.value
}

const handleOnInputEmail = value => {
  const proposalName = value.substring(0, value.indexOf('@'))
  formData.name = formData.name ? formData.name : proposalName
  formData.workspace_name = formData.workspace_name ? formData.workspace_name : proposalName
}

const handleLogin = async () => {
  authStore.signUpStep = 0

  if (!loginFormRef.value.validate()) {
    return
  }
  loading.value = true

  const name = formData.name
  const email = formData.email
  const workspace_name = formData.workspace_name || formData.name

  const account = await authStore.createAccount({
    ...formData,
    name,
    email,
    workspace_name,
    front_end_url: window.location.origin
  })

  if (account && account.response && account.response.status === 400) {
    Object.assign(error, account.response.data)

    loading.value = false

    return
  }

  authStore.authData = { email, password: formData.password }
  authStore.signUpStep = 1
}

const resetError = () =>
  Object.assign(error, { name: '', email: '', password: '', workspace_name: '', terms_of_use: '' })

watch(formData, _ => {
  if (Object.values(error).some(item => item.length)) {
    resetError()
  }
})
</script>
