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
      <v-text-field v-model="username" dense outlined validate-on-blur autocomplete="off" label="Username" required />
      <v-text-field
        dense
        outlined
        v-model="password"
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
          <v-icon class="custom-loader" dark>
            mdi-loading
          </v-icon>
        </template>
      </v-btn>
    </v-form>
  </div>
</template>

<script>
// :rules="[RULES.min('Must be at least 3 characters long', 3), RULES.required('Username is required')]"
import useAuthStore from '../composition/useAuthStore'
import useValidationRules from '@/core/composition/useValidationRules'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'
import { ref, reactive, computed, defineComponent, onMounted, toRefs } from '@vue/composition-api'

export default defineComponent({
  name: 'TheSignIn',

  setup(rops, context) {
    const authStore = useAuthStore()
    const workspaceStore = useWorkspaceStore()

    const RULES = useValidationRules()
    const { token } = context.root.$route.params
    const { peopleId, workspaceId } = context.root.$route.query

    const username = ref('')
    const password = ref('')
    const expand = ref(false)
    const loading = ref(false)

    const isFormValid = ref(false)
    const isShowPassword = ref(false)
    const isSuccesLogedIn = ref(false)
    const loginFormRef = ref(context.root.$refs.loginFormRef)
    const loginForm = computed(() => loginFormRef.value)

    const loadingText = ref('Login on AskAnna...')

    const handleLogin = async () => {
      if (!loginForm.value.validate()) {
        return
      }

      loading.value = true
      let result = null

      const auth = await authStore.actions.login({
        username: username.value,
        password: password.value,
        redirect: false
      })

      if (auth) {
        loadingText.value = 'Accept invitataion...'

        result = await workspaceStore.acceptInvitetion({
          token,
          peopleId,
          workspaceId
        })
      }

      if (result && result.status === 'accepted') {
        console.log(result)
        loadingText.value = 'Join to workspace...'
        setTimeout(() => context.root.$router.push({ path: `/${workspaceId}` }), 1000)

        return
      }
      loading.value = false
    }

    const reset = () => loginForm.value.reset()
    const resetValidation = () => loginForm.value.resetValidation()

    return {
      ...authStore,
      loadingText,
      RULES,
      loading,
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
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
