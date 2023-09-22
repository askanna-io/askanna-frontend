<template>
  <div class="flex flex-col">
    <div class="w-full sm:w-7/12 md:w-4/12">
      <AskAnnaTextField
        autofocus
        required
        label="Email"
        class="pb-2"
        validate-on="blur"
        v-model="state.email"
        :error-messages="error.email[0]"
        @update:modelValue="handleOnInput($event, 'email')"
        :rules="[RULES.required('Email is required'), RULES.email('The email you entered is not valid', 3)]"
      />
    </div>
    <div class="w-full sm:w-7/12 md:w-4/12">
      <AskAnnaTextField
        counter
        class="pb-2"
        label="Current password"
        v-model="state.old_password"
        :error-messages="error.old_password"
        :type="isShowCurrentPassword ? 'text' : 'password'"
        @update:modelValue="handleOnInput($event, 'old_password')"
        @click:append-inner="isShowCurrentPassword = !isShowCurrentPassword"
        :append-inner-icon="isShowCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[RULES.min('The password should be longer than 10 characters', 10)]"
      />
      <input
        type="password"
        style="display: none"
        autocomplete="new-password"
        browserAutocomplete="new-password"
      />
    </div>
    <div class="w-full sm:w-7/12 md:w-4/12">
      <AskAnnaTextField
        counter
        class="pb-2"
        label="New password"
        v-model="state.password"
        :error-messages="error.password"
        :type="isShowNewPassword ? 'text' : 'password'"
        @update:modelValue="handleOnInput($event, 'password')"
        @click:append-inner="isShowNewPassword = !isShowNewPassword"
        :append-inner-icon="isShowNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[RULES.min('The new password should be longer than 10 characters', 10)]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  userProfile: {
    type: Object,
    default: function () {
      return {
        email: '',
        password: '',
        old_password: ''
      }
    }
  },
  error: {
    type: Object,
    default: function () {
      return {
        email: '',
        password: '',
        old_password: ''
      }
    }
  }
})

const emit = defineEmits(['onUpdateUserProfile'])

const { RULES } = useValidationRules()

const isShowNewPassword = ref(false)
const isShowCurrentPassword = ref(false)
const state = ref({ ...props.userProfile })

watchOnce(() => props.userProfile, () => {
  state.value = { ...props.userProfile }
})

const handleOnInput = (value, path) => emit('onUpdateUserProfile', { [path]: value })
</script>