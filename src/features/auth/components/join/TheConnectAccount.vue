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
        :error-messages="error.email"
        :rules="[RULE.required('The email is required'), RULE.email('The email you entered is not valid', 3)]"
        dense
        outlined
        validate-on-blur
        autocomplete="off"
        label="Email"
        required
      />
      <v-text-field
        dense
        outlined
        v-model="password"
        :error-messages="error.password"
        :rules="[
          RULE.required('The password is required'),
          RULE.min('The password should be longer than 10 characters', 10)
        ]"
        :append-icon="isShowPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
        :type="isShowPassword ? 'text' : 'password'"
        name="input-10-1"
        label="Password"
        counter
        @click:append="isShowPassword = !isShowPassword"
      />
      <input type="password" style="display: none;" browserAutocomplete="new-password" autocomplete="new-password" />
      <v-btn :disabled="!isFormValid" :loading="loading" color="primary" class="mr-4" @click.stop="handleLogin">
        Sign in, connect and join
        <template v-slot:loader>
          <span>{{ loadingText }}...</span>
          <v-icon class="ask-anna-btn-loader" dark>
            mdi-loading
          </v-icon>
        </template>
      </v-btn>
    </v-form>
    <join-existing-account-popup
      :value="joinExistDialog"
      :workspaceName="workspaceName"
      @changeValue="handleJoinExist"
      @closeDialog="handleCloseDialog"
    />
  </div>
</template>

<script>
import { get } from 'lodash'
import useAuthStore from '../../composition/useAuthStore'
import JoinExistingAccountPopup from './JoinExistingAccountPopup'
import useValidationRules from '@/core/composition/useValidationRules'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { ref, reactive, computed, defineComponent, onMounted, toRefs } from '@vue/composition-api'

export default defineComponent({
  name: 'TheSignIn',

  components: { JoinExistingAccountPopup },

  setup(_, context) {
    const authStore = useAuthStore()
    const router = useRouterAskAnna()
    const workspaceStore = useWorkspaceStore()

    const validationRules = useValidationRules()
    const { token, peopleId, workspaceId, workspaceName } = context.root.$route.params

    const step = ref(0)
    const loadingTexts = ['Login on AskAnna', 'Accept invitataion', 'Join to workspace']
    const loadingText = computed(() => loadingTexts[step.value])

    const username = ref('')
    const password = ref('')
    const expand = ref(false)
    const loading = ref(false)

    const errorData = reactive({
      error: { name: '', email: '', username: '', password: '' }
    })

    const loginFormRef = ref(null)
    const isFormValid = ref(false)
    const isShowPassword = ref(false)
    const isSuccesLogedIn = ref(false)

    const joinExistDialog = ref(false)

    const joinToWorkpase = () => {
      step.value = 2
      setTimeout(() => router.push({ name: 'workspace', params: { workspaceId } }), 1000)
    }

    const handleLogin = async () => {
      step.value = 0
      if (!loginFormRef.value.validate()) {
        return
      }

      let result = null
      loading.value = true

      const auth = await authStore.actions.login({
        username: username.value,
        password: password.value,
        redirect: false
      })

      if (auth && auth.key) {
        step.value = 1

        result = await workspaceStore.acceptInvitetion({
          token,
          peopleId,
          workspaceId
        })
      }

      if (result && auth.response && auth.response.status === 400) {
        loading.value = false

        errorData.error = { ...errorData.error, ...auth.response.data }

        return
      }

      if (result && result.status === 'accepted') {
        joinToWorkpase()
        return
      }

      if (get(result, 'response.status') === 400) {
        if (get(result, 'response.data.user[0]') === 'User is already part of this membership') {
          joinExistDialog.value = true
        }
      }
      loading.value = false
    }

    const reset = () => loginFormRef.value.reset()
    const resetValidation = () => loginFormRef.value.resetValidation()

    const handleJoinExist = val => {
      joinExistDialog.value = val
      if (val) {
        joinToWorkpase()
      }
    }
    const handleCloseDialog = () => (joinExistDialog.value = false)

    return {
      ...authStore,
      ...toRefs(errorData),

      loadingText,
      joinExistDialog,
      RULE: validationRules.RULES,
      loading,
      username,
      password,
      isFormValid,
      loginFormRef,
      isShowPassword,
      isSuccesLogedIn,
      reset,
      workspaceName,
      handleLogin,
      resetValidation,
      handleJoinExist,
      handleCloseDialog
    }
  }
})
</script>
