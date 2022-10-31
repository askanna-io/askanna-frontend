<template>
  <AskAnnaCard flat>
    <AskAnnaContainer fluid>
      <AskAnnaRow dense justify="start">
        <AskAnnaCol xs="12" sm="6" md="4" lg="4" xl="3">
          <AskAnnaTextField
            dense
            autofocus
            outlined
            required
            label="Email"
            :value="userProfile.email"
            :error-messages="error.email"
            @input="handleOnInput($event, 'email')"
            :rules="[RULES.required('Email is required'), RULES.email('The email you entered is not valid', 3)]"
          />
        </AskAnnaCol>
      </AskAnnaRow>
      <AskAnnaRow dense justify="start">
        <AskAnnaCol xs="12" sm="6" md="4" lg="4" xl="3">
          <AskAnnaTextField
            dense
            counter
            outlined
            label="Current password"
            :value="userProfile.old_password"
            :error-messages="error.old_password"
            @input="handleOnInput($event, 'old_password')"
            :type="isShowCurrentPassword ? 'text' : 'password'"
            @click:append="isShowCurrentPassword = !isShowCurrentPassword"
            :append-icon="isShowCurrentPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
            :rules="[RULES.min('The password should be longer than 10 characters', 10)]"
          />
          <input type="password" style="display: none" browserAutocomplete="new-password" autocomplete="new-password" />
        </AskAnnaCol>
      </AskAnnaRow>
      <AskAnnaRow dense justify="start">
        <AskAnnaCol xs="12" sm="6" md="4" lg="4" xl="3">
          <AskAnnaTextField
            dense
            counter
            outlined
            label="New password"
            :value="userProfile.password"
            :error-messages="error.password"
            @input="handleOnInput($event, 'password')"
            :type="isShowNewPassword ? 'text' : 'password'"
            @click:append="isShowNewPassword = !isShowNewPassword"
            :append-icon="isShowNewPassword ? 'far fa-eye' : 'fas fa-eye-slash'"
            :rules="[RULES.min('The new password should be longer than 10 characters', 10)]"
          />
        </AskAnnaCol>
      </AskAnnaRow>
    </AskAnnaContainer>
  </AskAnnaCard>
</template>

<script setup lang="ts">
defineProps({
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

const handleOnInput = (value, path) => emit('onUpdateUserProfile', { [path]: value })
</script>
