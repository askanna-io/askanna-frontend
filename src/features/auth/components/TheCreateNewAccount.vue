<template>
  <v-form ref="loginFormRef" v-model="isFormValid" @keyup.native.enter="handleLogin" @submit="handleLogin">
    <v-checkbox v-model="isEmailEqName" class="mt-0" label="Use email address as username" />
    <v-text-field
      v-if="!isEmailEqName"
      :rules="[RULE.required('The name is required')]"
      dense
      outlined
      label="Name"
      validate-on-blur
      v-model="name"
    />
    <v-text-field
      v-if="!isEmailEqName"
      :rules="[RULE.required('The user name is required')]"
      dense
      outlined
      label="User name"
      validate-on-blur
      v-model="username"
    />
    <v-text-field
      v-model="email"
      dense
      outlined
      validate-on-blur
      label="Email address"
      :rules="[
        RULE.email('The email address you entered is not valid', 3),
        RULE.required('The email address is required')
      ]"
    />
    <v-text-field
      dense
      counter
      outlined
      validate-on-blur
      label="Password"
      v-model="password"
      :rules="[
        RULE.required('The password is required'),
        RULE.min('The password should be longer than 10 characters', 10)
      ]"
      :type="isShowPassword ? 'text' : 'password'"
      @click:append="isShowPassword = !isShowPassword"
    />
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
import useAuthStore from '../composition/useAuthStore'
import useValidationRules from '@/core/composition/useValidationRules'
import { ref, toRefs, reactive, defineComponent } from '@vue/composition-api'
import useWorkspaceStore from '@/features/workspace/composition/useWorkSpaceStore'

export default defineComponent({
  name: 'TheCreateNewAccount',

  setup(rops, context) {
    const authStore = useAuthStore()
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
      email: '',
      username: '',
      password: ''
    })

    const { token, peopleId, workspaceId } = context.root.$route.params
    const loadingTexts = ['Creating accout', 'Accept invitataion...', 'Join to workspace...']

    const reset = () => loginFormRef.value.reset()
    const resetValidation = () => loginFormRef.value.resetValidation()

    const handleLogin = async () => {
      errorMessages.value = []
      if (!loginFormRef.value.validate()) {
        return
      }
      loading.value = true

      const name = isEmailEqName.value ? formData.email : formData.name
      const username = isEmailEqName.value ? formData.email : formData.username

      step.value = 1

      const account = await authStore.actions.createAccount({ ...formData, name, username })

      if (account && account.response && account.response.status === 400) {
        errorMessages.value = account.response.data.non_field_errors
        loading.value = false

        return
      }

      let invatation = null
      if (account && account.short_uuid) {
        step.value = 2

        invatation = await workspaceStore.acceptInvitetion({
          token,
          peopleId,
          workspaceId
        })
      }

      if (invatation && invatation.status === 'accepted') {
        step.value = 3

        setTimeout(() => context.root.$router.push({ name: 'workspace', params: { workspaceId } }), 1000)

        return
      }

      step.value = 0
      loading.value = false
    }

    return {
      loading,
      ...toRefs(formData),
      isFormValid,
      loginFormRef,
      errorMessages,
      isEmailEqName,
      isShowPassword,
      loadingText: loadingTexts[step.value],
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
