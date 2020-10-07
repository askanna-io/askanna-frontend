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
      <v-btn :disabled="!isFormValid" color="primary" class="mr-4" @click.stop="handleLogin">
        Sign in, connect and join
      </v-btn>
      <v-checkbox v-if="isNotBeta" dense label="Remember me" />
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

    const isFormValid = ref(false)
    const isShowPassword = ref(false)
    const isSuccesLogedIn = ref(false)
    const loginFormRef = ref(context.root.$refs.loginFormRef)
    const loginForm = computed(() => loginFormRef.value)

    console.log(workspaceStore)
    const handleLogin = async () => {
      if (!loginForm.value.validate()) {
        return
      }
      let result = null

      console.log(token, workspaceId, peopleId)

      const auth = await authStore.actions.login({
        username: username.value,
        password: password.value,
        redirect: false
      })

      /*
created: "2020-10-07T11:10:05.502848Z"
created_by: {uuid: "616e6472-6969-4061-736b-616e6e612121", short_uuid: "2xqh-igGl-4Cls-ObsM", name: "Andrii"}
description: null
modified: "2020-10-07T11:10:05.503099Z"
name: "1212"
short_uuid: "7WOW-kgag-q7Un-gne8"
status: 1
template: null
uuid: "f72a8088-df64-45ec-ae34-b64f997d29ad"
      */
      if (auth) {
        result = await workspaceStore.acceptInvitetion({
          token,
          peopleId,
          workspaceId
        })
      }
      console.log(result)
      console.log()
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
