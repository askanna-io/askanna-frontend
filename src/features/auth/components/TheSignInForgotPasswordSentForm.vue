<template>
  <VForm
    v-if="!isSent"
    @submit.prevent
    v-model="isFormValid"
    ref="forgotPasswordSentFormRef"
    @keyup.enter.prevent="handleSentEmail"
  >
    <p class="px-0 pb-3">Enter your email below and we will send you the password reset instructions.
    </p>
    <AskAnnaTextField
      v-model="email"
      required
      class="pb-2"
      label="Email"
      validate-on="blur"
      autocomplete="off"
      :error-messages="error.email"
      :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
    />
    <AskAnnaButton
      type="submit"
      size="default"
      color="primary"
      variant="elevated"
      @click.stop="handleSentEmail"
    >
      <p class="truncate text-white text-clip">Email me the reset instructions</p>
    </AskAnnaButton>
  </VForm>
  <div v-if="isSent">
    <p>We have successfully processed your password reset request.</p>
    <p>
      The password reset instructions are sent from “AskAnna (support@askanna.io)”. The email can end up in your spam
      filter. Please check it in case you did not receive the email in your inbox. If you still don't see the reset
      email, contact us at <a
        href="mailto:support@askanna.io"
        target="_blank"
      >support@askanna.io</a>.
    </p>
  </div>
  <AskAnnaButtonText
    class="mt-4"
    @click.stop="handleGoToLogin"
  >
    I remember my password, let's go back
  </AskAnnaButtonText>
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
const isFormValid = ref(true)
const forgotPasswordSentFormRef = ref()

let error = reactive({ email: '', email: '' })

const forgotPasswordSentForm = computed(() => forgotPasswordSentFormRef.value as VForm)

const handleSentEmail = async () => {
  if (!forgotPasswordSentForm.value.validate()) {
    isFormValid.value = false
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