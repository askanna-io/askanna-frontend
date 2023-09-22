<template>
  <VForm
    @submit.prevent
    ref="loginFormRef"
    v-model="isFormValid"
    @keyup.enter="handleLogin"
  >
    <AskAnnaTextField
      v-model="formData.name"
      required
      label="Name"
      class="pb-2"
      validate-on="blur"
      :error-messages="error.name"
      :rules="[RULES.required('The name is required')]"
    />
    <AskAnnaTextField
      v-model="formData.email"
      required
      class="pb-2"
      label="Email"
      validate-on="blur"
      @input="handleOnInputEmail"
      :error-messages="error.email"
      :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
    />
    <AskAnnaTextField
      counter
      required
      validate-on="blur"
      label="Password"
      v-model="formData.password"
      :error-messages="error.password"
      :type="isShowPassword ? 'text' : 'password'"
      :rules="[
          RULES.required('The password is required'),
          RULES.min('The password should be longer than 10 characters', 10)
        ]"
      :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="isShowPassword = !isShowPassword"
    />
    <AskAnnaCheckbox
      required
      v-model="formData.terms_of_use"
      :error-messages="error.terms_of_use"
      class="pb-2 [&>div>div>label]:opacity-100 [&>div:nth-child(2)]:pl-1"
      :rules="[RULES.required('The Terms of Use and Data Processing Agreement is required')]"
    >
      <template v-slot:label>
        <p class="pl-2 leading-5">
          I accept the
          <a
            target="_blank"
            href="https://askanna.io/terms/"
            @click.stop
          > Terms of Use</a>
          and
          <a
            target="_blank"
            href="https://askanna.io/dpa/"
            @click.stop
          >
            Data Processing Agreement
          </a>
        </p>
      </template>
    </AskAnnaCheckbox>
    <span
      v-if="errorMessages.length"
      class="text-error text-caption"
    >
      <template v-for="error in errorMessages">
        {{ error }}
      </template>
    </span>
    <AskAnnaButton
      type="submit"
      class="mr-4"
      size="default"
      color="primary"
      :loading="loading"
      variant="elevated"
      @click="handleLogin"
      :disabled="loading"
      :loadingText="loadingText"
    >
      Create account and join
    </AskAnnaButton>
  </VForm>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const peopleStore = usePeopleStore()
const { RULES } = useValidationRules()
const { route, routerPush } = useRouterAskAnna()

const { token, peopleId, workspaceId } = route.params
const loadingTexts = ['Creating account', 'Sign in', 'Accept invitataion', 'Join to workspace']

const step = ref(0)
const loading = ref(false)
const errorMessages = ref([])
const isFormValid = ref(true)
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

  const { valid } = await loginFormRef.value.validate()
  if (!valid) {
    isFormValid.value = false
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