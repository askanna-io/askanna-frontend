<template>
  <VForm
    @submit.prevent
    ref="loginFormRef"
    v-model="isFormValid"
    @keyup.enter="handleLogin"
  >
    <AskAnnaTextField
      v-model="formData.email"
      required
      label="Email"
      class="pb-2"
      validate-on="blur"
      autocomplete="off"
      :error-messages="error.email"
      :rules="[
          RULES.required('The email is required'),
          RULES.email('The email you entered is not valid', 3)
        ]"
    />
    <AskAnnaTextField
      v-model="formData.password"
      counter
      autocomplete
      label="Password"
      :error-messages="error.password"
      :type="isShowPassword ? 'text' : 'password'"
      :rules="[RULES.required('The password is required')]"
      :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="isShowPassword = !isShowPassword"
    />
    <AskAnnaButton
      type="submit"
      size="default"
      color="primary"
      variant="elevated"
      class="mr-4 w-52"
      :loading="loading"
      loadingText="Sign in'"
      @click.stop="handleLogin"
    >
      {{ submitButtonTitle }}
    </AskAnnaButton>
  </VForm>
</template>

<script setup lang="ts">
defineProps({
  submitButtonTitle: {
    type: String,
    default: 'Log in to AskAnna'
  }
})

const authStore = useAuthStore()
const { RULES } = useValidationRules()
const { routerPush } = useRouterAskAnna()

const loading = ref(false)
const loginFormRef = ref(null)
const isFormValid = ref(true)
const isShowPassword = ref(false)

const formData = reactive({
  email: '',
  password: ''
})
let error = reactive({ name: '', email: '', password: '' })

const handleLogin = async () => {
  const { valid } = await loginFormRef.value.validate()
  if (!valid) {
    isFormValid.value = false
    return
  }

  loading.value = true

  const authError = await authStore.login(formData)

  loading.value = false

  if (authError && authError.response && authError.response.status === 400) {
    Object.assign(error, authError.response.data)

    return
  }

  routerPush({ name: 'check-access' })
}

const resetError = () => Object.assign(error, { name: '', email: '', password: '' })

watch(formData, () => {
  if (Object.values(error).some(item => item.length)) {
    resetError()
  }
})
</script>