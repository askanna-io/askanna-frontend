<template>
  <VForm
    ref="loginFormRef"
    lazy-validation
    v-model="isFormValid"
    @submit="handleLogin"
    @keyup.native.enter="handleLogin"
  >
    <AskAnnaTextField
      dense
      outlined
      label="Name"
      validate-on-blur
      v-model="formData.name"
      :error-messages="error.name"
      :rules="[RULES.required('The name is required')]"
    />
    <AskAnnaTextField
      v-model="formData.email"
      :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
      dense
      outlined
      label="Email"
      validate-on-blur
      @input="handleOnInputEmail"
      :error-messages="error.email"
    />
    <AskAnnaTextField
      dense
      counter
      outlined
      validate-on-blur
      label="Password"
      v-model="formData.password"
      :error-messages="error.password"
      :type="isShowPassword ? 'text' : 'password'"
      :rules="[
        RULES.required('The password is required'),
        RULES.min('The password should be longer than 10 characters', 10)
      ]"
      @click:append="isShowPassword = !isShowPassword"
    />
    <AskAnnaCheckbox
      dense
      class="pt-0 mt-0"
      v-model="formData.terms_of_use"
      :rules="[RULES.required('The Terms of Use and Data Processing Agreement is required')]"
      :error-messages="error.terms_of_use"
    >
      <template v-slot:label>
        <div>
          I accept the
          <a class="ask-anna-link" target="_blank" href="https://askanna.io/terms/" @click.stop> Terms of Use </a>
          and
          <a class="ask-anna-link" target="_blank" href="https://askanna.io/dpa/" @click.stop>
            Data Processing Agreement
          </a>
        </div>
      </template>
    </AskAnnaCheckbox>
    <span v-if="errorMessages.length" class="error--text text-caption">
      <template v-for="error in errorMessages">
        {{ error }}
      </template>
    </span>
    <input type="password" style="display: none" browserAutocomplete="new-password" autocomplete="new-password" />
    <AskAnnaButton :disabled="!isFormValid" :loading="loading" color="primary" class="mr-4" @click="handleLogin">
      Create account and join
      <template v-slot:loader>
        <span>{{ loadingText }}...</span>
        <AskAnnaIcon class="ask-anna-btn-loader" dark> mdi-loading </AskAnnaIcon>
      </template>
    </AskAnnaButton>
  </VForm>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const peopleStore = usePeopleStore()
const { RULES } = useValidationRules()
const { route, routerPush } = useRouterAskAnna()

const { token, peopleId, workspaceId } = route.params
const loadingTexts = ['Creating accout', 'Sign in', 'Accept invitataion', 'Join to workspace']

const step = ref(0)
const loading = ref(false)
const errorMessages = ref([])
const isFormValid = ref(false)
const loginFormRef = ref(null)
const isShowPassword = ref(false)

const formData = reactive({
  name: peopleStore.invitation.email.substring(0, peopleStore.invitation.email.indexOf('@')) || '',
  password: '',
  terms_of_use: false,
  email: peopleStore.invitation.email || ''
})

let error = reactive({
  name: '',
  email: '',
  password: '',
  terms_of_use: ''
})
const loadingText = computed(() => loadingTexts[step.value])

const handleOnInputEmail = value => {
  formData.name = formData.name ? formData.name : value.substring(0, value.indexOf('@'))
}

const handleLogin = async () => {
  step.value = 0
  errorMessages.value = []
  if (!loginFormRef.value.validate()) {
    return
  }
  loading.value = true

  const name = formData.name || undefined
  const email = formData.email
  const account = await authStore.createAccount({
    ...formData,
    name,
    email,
    front_end_url: window.location.origin
  })

  if (account && account.response && account.response.status === 400) {
    Object.assign(error, account.response.data)

    loading.value = false
    step.value = 0

    return
  }

  step.value = 1

  const auth = await authStore.login({
    email: email,
    password: formData.password
  })

  let invatation = null
  if (account && account.suuid && auth && auth.key) {
    step.value = 2

    invatation = await peopleStore.acceptInvitetion({
      token,
      peopleId,
      workspaceId
    })
  }

  if (invatation && invatation.status == 204) {
    step.value = 3

    setTimeout(() => routerPush({ name: 'workspace', params: { workspaceId } }), 1000)

    return
  }

  loading.value = false
  step.value = 0
}

const resetError = () => Object.assign(error, { name: '', email: '', password: '', terms_of_use: '' })

watch(formData, async () => {
  // check if exist error from backend on typing fields, try resest validation
  if (Object.values(error).some(item => item.length)) {
    resetError()
  }
})
</script>
