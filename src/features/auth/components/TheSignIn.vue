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
      <v-text-field v-model="username" validate-on-blur autocomplete="off" label="Username" required />
      <v-text-field
        v-model="password"
        :append-icon="isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
        :type="isShowPassword ? 'text' : 'password'"
        name="input-10-1"
        label="Password"
        counter
        @click:append="isShowPassword = !isShowPassword"
      />
      <input type="password" style="display: none;" browserAutocomplete="new-password" autocomplete="new-password" />
      <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click.stop="handleLogin">
        Sign in
      </v-btn>
      <v-checkbox v-if="isNotBeta" dense label="Remember me" />
    </v-form>
  </div>
</template>

<script lang="ts">
// :rules="[RULES.min('Must be at least 3 characters long', 3), RULES.required('Username is required')]"
import useAuthStore from '../composition/useAuthStore'
import useValidationRules from '@/core/composition/useValidationRules'
import { ref, reactive, computed, defineComponent, onMounted, toRefs } from '@vue/composition-api'

type VForm = Vue & {
  reset: () => void
  validate: () => boolean
  resetValidation: () => void
}

export default defineComponent({
  name: 'TheSignIn',

  setup(rops, context) {
    const authStore = useAuthStore()
    const RULES = useValidationRules()

    const username = ref('')
    const password = ref('')
    const expand = ref(false)

    const isFormValid = ref(false)
    const isShowPassword = ref(false)
    const isSuccesLogedIn = ref(false)
    const loginFormRef = ref(context.root.$refs.loginFormRef)
    const loginForm = computed(() => loginFormRef.value as VForm)

    const handleLogin = () => {
      if (!loginForm.value.validate()) {
        return
      }
      authStore.actions.login({ username: username.value, password: password.value })
    }

    const reset = () => loginForm.value.reset()
    const resetValidation = () => loginForm.value.resetValidation()

    return {
      ...authStore,
      RULES,
      username,
      password,
      loginForm,
      isFormValid,
      loginFormRef,
      isShowPassword,
      isSuccesLogedIn,
      reset,
      handleLogin,
      resetValidation
    }
  }
})
</script>
