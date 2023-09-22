<template>
    <VForm
        @submit.prevent
        ref="loginFormRef"
        v-model="isFormValid"
        @keyup.enter="handleLogin"
    >
        <AskAnnaTextField
            label="Name"
            class="pb-2"
            validate-on="blur"
            @blur="handleOnBlurName"
            :model-value="formData.name"
            :error-messages="errors.name"
            :rules="[RULES.required('The name is required')]"
        />
        <AskAnnaTextField
            class="pb-2"
            label="Email"
            validate-on="blur"
            v-model="formData.email"
            :error-messages="errors.email"
            @update:modelValue="handleOnInputEmail"
            :rules="[RULES.required('The email is required'), RULES.email('The email you entered is not valid', 3)]"
        />
        <AskAnnaTextField
            counter
            class="pb-2"
            validate-on="blur"
            label="Password"
            v-model="formData.password"
            :error-messages="errors.password"
            :type="isShowPassword ? 'text' : 'password'"
            :rules="[
                    RULES.required('The password is required'),
                    RULES.min('The password should be longer than 10 characters', 10)
                ]"
            :append-inner-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="isShowPassword = !isShowPassword"
        />
        <AskAnnaTextField
            validate-on="blur"
            label="Workspace name"
            v-model="formData.workspace_name"
            :error-messages="errors.workspace_name"
            :rules="[RULES.required('The workspace name is required')]"
        />
        <AskAnnaCheckbox
            class="pb-2 [&>div>div>label]:opacity-100 [&>div:nth-child(2)]:pl-1"
            v-model="formData.terms_of_use"
            :error-messages="errors.terms_of_use"
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
        <AskAnnaButton
            class="mr-4"
            type="submit"
            size="default"
            color="primary"
            variant="elevated"
            :loading="loading"
            @click="handleLogin"
            :loadingText="loadingText"
        >
            Create your account
        </AskAnnaButton>
    </VForm>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const { RULES } = useValidationRules()

const loading = ref(false)
const isFormValid = ref(true)
const loginFormRef = ref(null)
const isShowPassword = ref(false)

const formData = reactive({
    name: '',
    email: '',
    password: '',
    workspace_name: '',
    terms_of_use: false
})

const loadingTexts = ['Creating account', 'Creating workspace']
const loadingText = computed(() => loadingTexts[authStore.signUpStep])
const errors = reactive({ name: '', email: '', password: '', workspace_name: '', terms_of_use: '' })

const handleOnBlurName = $e => {
    if (formData.workspace_name === '' || formData.workspace_name === formData.name) {
        formData.workspace_name = $e?.target?.value
    }
    formData.name = $e?.target?.value
}

const handleOnInputEmail = value => {
    const proposalName = value.substring(0, value.indexOf('@'))
    formData.name = formData.name ? formData.name : proposalName
    formData.workspace_name = formData.workspace_name ? formData.workspace_name : proposalName
}

const handleLogin = async () => {
    authStore.signUpStep = 0

    const { valid } = await loginFormRef.value.validate()
    if (!valid) {
        isFormValid.value = false
        return
    }

    loading.value = true

    const name = formData.name
    const email = formData.email
    const workspace_name = formData.workspace_name || formData.name

    const account = await authStore.createAccount({
        ...formData,
        name,
        email,
        workspace_name,
        front_end_url: window.location.origin
    })

    if (account && account.response && account.response.status === 400) {
        Object.assign(errors, account.response.data)

        loading.value = false

        return
    }

    authStore.authData = { email, password: formData.password }
    authStore.signUpStep = 1
}

const resetError = () =>
    Object.assign(errors, { name: '', email: '', password: '', workspace_name: '', terms_of_use: '' })

watch(formData, _ => {
    if (Object.values(errors).some(item => item.length)) {
        resetError()
    }
})
</script>