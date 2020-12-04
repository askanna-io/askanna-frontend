<template>
  <div>
    <v-form
      v-if="!isPasswordReset"
      ref="forgotPasswordSentFormRef"
      v-model="isFormValid"
      lazy-validation
      @submit.stop.prevent="handleResetPassword"
      @keyup.native.enter.prevent="handleResetPassword"
    >
      <v-text-field
        dense
        outlined
        v-model="password"
        :error-messages="error.new_password1 || error.new_password2"
        :rules="[
          RULE.required('The password is required'),
          RULE.min('The password should be longer than 10 characters', 10)
        ]"
        :append-icon="isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
        :type="isShowPassword ? 'text' : 'password'"
        name="input-10-1"
        label="New password"
        counter
        @click:append="isShowPassword = !isShowPassword"
      />

      <v-btn :disabled="!isFormValid" color="primary" @click.stop="handleResetPassword">
        Reset password
      </v-btn>
    </v-form>
    <template v-else>
      Your password has been reset successfully! We will redirect you to the sign-in page.
    </template>
  </div>
</template>

<script lang="ts">
import useAuthStore from '../../../composition/useAuthStore'
import useValidationRules from '@/core/composition/useValidationRules'
import { ref, watch, reactive, computed, defineComponent, onMounted, toRefs } from '@vue/composition-api'

type VForm = Vue & {
  reset: () => void
  validate: () => boolean
  resetValidation: () => void
}

export default defineComponent({
  name: 'ResetForm',

  setup(rops, context) {
    const authStore = useAuthStore()
    const validationRules = useValidationRules()

    const { token, uid } = context.root.$route.query

    const errorData = reactive({
      error: { new_password1: '', new_password2: '' }
    })
    const password = ref('')

    const isFormValid = ref(false)
    const isShowPassword = ref(false)
    const isPasswordReset = ref(false)
    const forgotPasswordSentFormRef = ref(context.root.$refs.forgotPasswordSentFormRef)
    const forgotPasswordSentForm = computed(() => forgotPasswordSentFormRef.value as VForm)

    const handleResetPassword = async () => {
      if (!forgotPasswordSentForm.value.validate()) {
        return
      }
      const result = await authStore.actions.confirmResetPassword({
        uid,
        token,
        new_password1: password.value,
        new_password2: password.value
      })

      if (result && result.response && result.response.status === 400) {
        errorData.error = { ...errorData.error, ...result.response.data }

        return
      }
      isPasswordReset.value = true
      setTimeout(() => context.root.$router.push({ name: 'login' }), 3000)
    }

    const handleGoToLogin = () => context.emit('onOpenLogin')

    const reset = () => forgotPasswordSentForm.value.reset()
    const resetError = () => {
      errorData.error = { new_password1: '', new_password2: '' }
    }
    const resetValidation = () => forgotPasswordSentForm.value.resetValidation()

    watch(password, async password => {
      // check if exist error from backend on typing fields, try resest validation
      if (Object.values(errorData.error).some(error => error.length)) {
        resetError()
        resetValidation()
      }
    })

    return {
      ...authStore,
      ...toRefs(errorData),
      RULE: validationRules.RULES,
      reset,
      password,
      isFormValid,
      isShowPassword,
      isPasswordReset,
      resetValidation,
      handleGoToLogin,
      handleResetPassword,
      forgotPasswordSentForm,
      forgotPasswordSentFormRef
    }
  }
})
</script>
