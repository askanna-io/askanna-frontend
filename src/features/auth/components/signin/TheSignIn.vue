<template>
  <div>
    <VForm
      ref="loginFormRef"
      v-model="isFormValid"
      lazy-validation
      @keyup.native.enter="handleLogin"
      @submit.stop="handleLogin"
    >
      <AskAnnaTextField
        v-model="formData.email"
        :error-messages="error.email"
        dense
        outlined
        required
        label="Email"
        validate-on-blur
        autocomplete="off"
        :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
      />
      <AskAnnaTextField
        v-model="formData.password"
        :error-messages="error.password"
        :type="isShowPassword ? 'text' : 'password'"
        :append-icon="isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
        dense
        outlined
        name="input-10-1"
        label="Password"
        counter
        :rules="[RULES.required('The password is required')]"
        @click:append="isShowPassword = !isShowPassword"
      />
      <input type="password" style="display: none" browserAutocomplete="new-password" autocomplete="new-password" />
      <VBtn class="mr-4" color="primary" :loading="loading" :disabled="!isFormValid" @click.stop="handleLogin">
        {{ submitButtonTitle }}
        <template v-slot:loader>
          <span>Sign in...</span>
        </template>
      </VBtn>
    </VForm>
  </div>
</template>

<script setup lang="ts">
defineProps({
  submitButtonTitle: {
    type: String,
    default: 'Log in to AskAnna'
  }
})

const authStore = useAuthStore()
const { routerPush } = useRouterAskAnna()
const { RULES } = useValidationRules()

const loading = ref(false)
const loginFormRef = ref(null)
const isFormValid = ref(false)
const isShowPassword = ref(false)

const formData = reactive({
  email: '',
  password: ''
})
let error = reactive({ name: '', email: '', password: '' })

const handleLogin = async () => {
  if (!loginFormRef.value.validate()) {
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
