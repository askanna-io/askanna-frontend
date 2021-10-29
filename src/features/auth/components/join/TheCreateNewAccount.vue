<template>
  <v-form
    ref="loginFormRef"
    lazy-validation
    v-model="isFormValid"
    @submit="handleLogin"
    @keyup.native.enter="handleLogin"
  >
    <v-text-field dense outlined label="Name" validate-on-blur v-model="name" :error-messages="error.name" />
    <v-text-field
      v-model="email"
      :rules="[RULE.required('The email is required'), RULE.email('The email you entered is not valid', 3)]"
      dense
      outlined
      validate-on-blur
      label="Email"
      :error-messages="error.email"
    />
    <v-text-field
      dense
      counter
      outlined
      validate-on-blur
      label="Password"
      v-model="password"
      :error-messages="error.password"
      :type="isShowPassword ? 'text' : 'password'"
      :rules="[
        RULE.required('The password is required'),
        RULE.min('The password should be longer than 10 characters', 10)
      ]"
      @click:append="isShowPassword = !isShowPassword"
    />
    <v-checkbox
      dense
      class="pt-0 mt-0"
      v-model="terms_of_use"
      :rules="[RULE.required('The Terms of Use and Data Processing Agreement is required')]"
      :error-messages="error.terms_of_use"
    >
      <template v-slot:label>
        <div>
          I accept the
          <a class="ask-anna-link" target="_blank" href="https://askanna.io/terms/" @click.stop>
            Terms of Use
          </a>
          and
          <a class="ask-anna-link" target="_blank" href="https://askanna.io/dpa/" @click.stop>
            Data Processing Agreement
          </a>
        </div>
      </template>
    </v-checkbox>
    <span v-if="errorMessages.length" class="error--text text-caption">
      <template v-for="error in errorMessages">
        {{ error }}
      </template>
    </span>
    <input type="password" style="display: none;" browserAutocomplete="new-password" autocomplete="new-password" />
    <v-btn :disabled="!isFormValid" :loading="loading" color="primary" class="mr-4" @click="handleLogin">
      Create account and join
      <template v-slot:loader>
        <span>{{ loadingText }}...</span>
        <v-icon class="ask-anna-btn-loader" dark>
          mdi-loading
        </v-icon>
      </template>
    </v-btn>
  </v-form>
</template>

<script>
import useAuthStore from '../../composition/useAuthStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useValidationRules from '@/core/composition/useValidationRules'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { ref, watch, toRefs, reactive, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'TheCreateNewAccount',

  setup(_, context) {
    const authStore = useAuthStore()
    const router = useRouterAskAnna()
    const workspaceStore = useWorkspaceStore()
    const validationRules = useValidationRules()

    const step = ref(0)
    const loading = ref(false)
    const errorMessages = ref([])
    const isFormValid = ref(false)
    const loginFormRef = ref(null)
    const isEmailEqName = ref(true)
    const isShowPassword = ref(false)

    const formData = reactive({
      name: '',
      email: workspaceStore.invitation.value.email || '',
      username: '',
      password: '',
      terms_of_use: false
    })

    const errorData = reactive({
      error: { name: '', email: '', username: '', password: '', terms_of_use: '' }
    })
    const loadingText = computed(() => loadingTexts[step.value])

    const { token, peopleId, workspaceId, workspaceName } = context.root.$route.params
    const loadingTexts = ['Creating accout', 'Sign in', 'Accept invitataion', 'Join to workspace']

    const reset = () => loginFormRef.value.reset()
    const resetValidation = () => loginFormRef.value.resetValidation()

    const handleLogin = async () => {
      step.value = 0
      errorMessages.value = []
      if (!loginFormRef.value.validate()) {
        return
      }
      loading.value = true

      const name = formData.name || undefined
      const username = formData.email
      const account = await authStore.actions.createAccount({
        ...formData,
        name,
        username,
        front_end_domain: window.location.origin
      })

      if (account && account.response && account.response.status === 400) {
        errorData.error = { ...errorData.error, ...account.response.data }

        loading.value = false
        step.value = 0

        return
      }

      step.value = 1

      const auth = await authStore.actions.login({
        username: username,
        password: formData.password,
        redirect: false
      })

      let invatation = null
      if (account && account.short_uuid && auth && auth.key) {
        step.value = 2

        invatation = await workspaceStore.acceptInvitetion({
          token,
          peopleId,
          workspaceId
        })
      }

      if (invatation && invatation.status === 'accepted') {
        step.value = 3

        setTimeout(() => router.push({ name: 'workspace', params: { workspaceId } }), 1000)

        return
      }

      loading.value = false
      step.value = 0
    }

    const resetError = () => {
      errorData.error = { name: '', email: '', username: '', password: '', terms_of_use: '' }
    }

    watch(formData, async (formData, prevFormData) => {
      // check if exist error from backend on typing fields, try resest validation
      if (Object.values(errorData.error).some(error => error.length)) {
        resetError()
        loginFormRef.value.resetValidation()
      }
    })

    return {
      loading,
      ...toRefs(formData),
      ...toRefs(errorData),
      loadingText,
      isFormValid,
      loginFormRef,
      errorMessages,
      isEmailEqName,
      isShowPassword,
      handleLogin,
      ...authStore,
      RULE: validationRules.RULES
    }
  }
})
</script>
<style scoped>
.login-wrapper {
  height: 100vh;
  background: rgb(176, 132, 182);
  background: linear-gradient(0deg, rgba(176, 132, 182, 1) 7%, rgba(14, 43, 50, 1) 57%);
}
.logo {
  height: 27px;
}
</style>
