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
        :error-messages="error.username || error.name || error.email"
        dense
        outlined
        validate-on-blur
        autocomplete="off"
        label="Email"
        required
        :rules="[RULE.required('The email is required'), RULE.email('The email you entered is not valid', 3)]"
      />
      <v-text-field
        v-model="password"
        :error-messages="error.password"
        :type="isShowPassword ? 'text' : 'password'"
        :append-icon="isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
        dense
        outlined
        name="input-10-1"
        label="Password"
        counter
        :rules="[
          RULE.required('The password is required'),
          RULE.min('The password should be longer than 10 characters', 10)
        ]"
        @click:append="isShowPassword = !isShowPassword"
      />
      <input type="password" style="display: none;" browserAutocomplete="new-password" autocomplete="new-password" />
      <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click.stop="handleLogin">
        {{ submitButtonTitle }}
      </v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import useAuthStore from '../composition/useAuthStore'
import useValidationRules from '@/core/composition/useValidationRules'
import { ref, watch, reactive, computed, defineComponent, onMounted, toRefs } from '@vue/composition-api'

type VForm = Vue & {
  reset: () => void
  validate: () => boolean
  resetValidation: () => void
}

export default defineComponent({
  name: 'TheSignIn',

  props: {
    submitButtonTitle: {
      type: String,
      default: 'Log in to AskAnna'
    }
  },

  setup(rops, context) {
    const authStore = useAuthStore()
    const validationRules = useValidationRules()

    const username = ref('')
    const password = ref('')
    const expand = ref(false)

    const isFormValid = ref(false)
    const isShowPassword = ref(false)
    const isSuccesLogedIn = ref(false)
    const loginFormRef = ref(context.root.$refs.loginFormRef)
    const loginForm = computed(() => loginFormRef.value as VForm)

    const formData = reactive({
      username: '',
      password: ''
    })
    const errorData = reactive({
      error: { name: '', email: '', username: '', password: '' }
    })

    const handleLogin = async () => {
      if (!loginForm.value.validate()) {
        return
      }
      const authError = await authStore.actions.login(formData)

      if (authError && authError.response && authError.response.status === 400) {
        errorData.error = { ...errorData.error, ...authError.response.data }

        return
      }
    }

    const reset = () => loginForm.value.reset()
    const resetValidation = () => loginForm.value.resetValidation()
    const resetError = () => {
      errorData.error = { name: '', email: '', username: '', password: '' }
    }

    watch(formData, async (formData, prevFormData) => {
      // check if exist error from backend on typing fields, try resest validation
      if (Object.values(errorData.error).some(error => error.length)) {
        resetError()
        resetValidation()
      }
    })

    return {
      ...authStore,
      ...toRefs(formData),
      ...toRefs(errorData),
      loginForm,
      handleLogin,
      isFormValid,
      loginFormRef,
      isShowPassword,
      isSuccesLogedIn,
      RULE: validationRules.RULES
    }
  }
})
</script>
