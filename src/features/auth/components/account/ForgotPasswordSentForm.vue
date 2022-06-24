<template>
  <div>
    <v-form
      v-if="!isSent"
      ref="forgotPasswordSentFormRef"
      v-model="isFormValid"
      lazy-validation
      @submit.stop.prevent="handleSentEmail"
      @keyup.native.enter.prevent="handleSentEmail"
    >
      <v-subheader class="px-0 pb-3"
        >Enter your email below and we will send you the password reset instructions.</v-subheader
      >
      <v-text-field
        v-model="username"
        dense
        outlined
        required
        validate-on-blur
        autocomplete="off"
        label="Email"
        :error-messages="error.email || error.username"
        :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
      />

      <v-btn :disabled="!isFormValid" color="primary" @click.stop="handleSentEmail">
        Email me the reset instructions
      </v-btn>
    </v-form>
    <div v-if="isSent">
      <p>We have successfully processed your password reset request.</p>
      <p>
        The password reset instructions are sent from “AskAnna (support@askanna.io)”. The email can end up in your spam
        filter. Please check it in case you did not receive the email in your inbox. If you still don't see the reset
        email, contact us at <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
      </p>
    </div>
    <v-btn text small class="forgot-link mr-4 mt-4 text--secondary" @click.stop="handleGoToLogin">
      I remember my password, let's go back
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/useAuthStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, watch, reactive, computed } from '@vue/composition-api'
import useValidationRules from '@/core/composition/useValidationRules'

type VForm = Vue & {
  reset: () => void
  validate: () => boolean
  resetValidation: () => void
}

const authStore = useAuthStore()
const router = useRouterAskAnna()
const { RULES } = useValidationRules()

const username = ref('')
const isSent = ref(false)
const isFormValid = ref(false)
const forgotPasswordSentFormRef = ref()

let error = reactive({ email: '', username: '' })

const forgotPasswordSentForm = computed(() => forgotPasswordSentFormRef.value as VForm)

const handleSentEmail = async () => {
  if (!forgotPasswordSentForm.value.validate()) {
    return
  }

  const response = await authStore.resetPassword({
    email: username.value,
    front_end_domain: window.location.origin
  })

  if (response && response.status === 400) {
    error = { ...error, ...response.data }

    return
  }

  isSent.value = true
}

const handleGoToLogin = () => router.push({ name: 'signin' })

const resetError = () => {
  error = { email: '', username: '' }
}

const resetValidation = () => forgotPasswordSentForm.value.resetValidation()

watch(username, async () => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(error).some(item => item.length)) {
    resetError()
    resetValidation()
  }
})
</script>
