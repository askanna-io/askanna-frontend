<template>
  <div>
    <v-form
      ref="loginFormRef"
      v-model="isFormValid"
      lazy-validation
      @keyup.native.enter="handleLogin"
      @submit.stop="handleLogin"
    >
      <v-text-field
        v-model="formData.username"
        :error-messages="error.username || error.name || error.email"
        dense
        outlined
        validate-on-blur
        autocomplete="off"
        label="Email"
        required
        :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
      />
      <v-text-field
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
      <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click.stop="handleLogin">
        {{ submitButtonTitle }}
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
type VForm = Vue & {
  reset: () => void
  validate: () => boolean
  resetValidation: () => void
}

defineProps({
  submitButtonTitle: {
    type: String,
    default: 'Log in to AskAnna'
  }
})

const authStore = useAuthStore()
const { RULES } = useValidationRules()

const loginFormRef = ref()
const isFormValid = ref(false)
const isShowPassword = ref(false)

const loginForm = computed(() => loginFormRef.value as VForm)

const formData = reactive({
  username: '',
  password: ''
})
let error = reactive({ name: '', email: '', username: '', password: '' })

const handleLogin = async () => {
  if (!loginForm.value.validate()) {
    return
  }
  const authError = await authStore.login(formData)

  if (authError && authError.response && authError.response.status === 400) {
    error = { ...error, ...authError.response.data }

    return
  }
}

const resetValidation = () => loginForm.value.resetValidation()
const resetError = () => {
  error = { name: '', email: '', username: '', password: '' }
}

watch(formData, async () => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(error).some(item => item.length)) {
    resetError()
    resetValidation()
  }
})
</script>
