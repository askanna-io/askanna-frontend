<template>
  <div>
    <VForm
      v-if="!isSent"
      ref="forgotPasswordSentFormRef"
      v-model="isFormValid"
      lazy-validation
      @submit.stop.prevent="handleSentEmail"
      @keyup.native.enter.prevent="handleSentEmail"
    >
      <AskAnnaSubHeader class="px-0 pb-3"
        >Enter your email below and we will send you the password reset instructions.</AskAnnaSubHeader
      >
      <AskAnnaTextField
        v-model="email"
        dense
        outlined
        required
        label="Email"
        validate-on-blur
        autocomplete="off"
        :error-messages="error.email"
        :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
      />

      <AskAnnaButton :disabled="!isFormValid" color="primary" @click.stop="handleSentEmail">
        Email me the reset instructions
      </AskAnnaButton>
    </VForm>
    <div v-if="isSent">
      <p>We have successfully processed your password reset request.</p>
      <p>
        The password reset instructions are sent from “AskAnna (support@askanna.io)”. The email can end up in your spam
        filter. Please check it in case you did not receive the email in your inbox. If you still don't see the reset
        email, contact us at <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
      </p>
    </div>
    <AskAnnaButton text small class="forgot-link mr-4 mt-4 text--secondary" @click.stop="handleGoToLogin">
      I remember my password, let's go back
    </AskAnnaButton>
  </div>
</template>

<script setup lang="ts">
type VForm = Vue & {
  reset: () => void
  validate: () => boolean
  resetValidation: () => void
}

const authStore = useAuthStore()
const { routerPush } = useRouterAskAnna()
const { RULES } = useValidationRules()

const email = ref('')
const isSent = ref(false)
const isFormValid = ref(false)
const forgotPasswordSentFormRef = ref()

let error = reactive({ email: '', email: '' })

const forgotPasswordSentForm = computed(() => forgotPasswordSentFormRef.value as VForm)

const handleSentEmail = async () => {
  if (!forgotPasswordSentForm.value.validate()) {
    return
  }

  const response = await authStore.resetPassword({
    email: email.value
  })

  if (response && response.status === 400) {
    Object.assign(error, response.data)
    return
  }

  isSent.value = true
}

const handleGoToLogin = () => routerPush({ name: 'signin' })

const resetError = () => Object.assign(error, { email: '' })

watch(email, async () => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(error).some(item => item.length)) {
    resetError()
  }
})
</script>
