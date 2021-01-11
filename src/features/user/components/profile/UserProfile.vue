<template>
  <v-card flat>
    <v-container fluid>
      <v-row dense justify="start">
        <v-col cols="4">
          <v-text-field
            dense
            autofocus
            outlined
            required
            label="Email"
            :value="userProfile.email"
            :error-messages="error.email"
            @input="handleOnInput($event, 'email')"
            :rules="[RULE.required('Email is required'), RULE.email('The email you entered is not valid', 3)]"
          />
        </v-col>
      </v-row>
      <v-row dense justify="start">
        <v-col cols="4">
          <v-text-field
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
            :rules="[RULE.min('The password should be longer than 10 characters', 10)]"
          />
          <input
            type="password"
            style="display: none;"
            browserAutocomplete="new-password"
            autocomplete="new-password"
          />
        </v-col>
      </v-row>
      <v-row dense justify="start">
        <v-col cols="4">
          <v-text-field
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
            :rules="[RULE.min('The new password should be longer than 10 characters', 10)]"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { ref, toRefs, reactive, computed, defineComponent } from '@vue/composition-api'
import useValidationRules from '@/core/composition/useValidationRules'

export default defineComponent({
  name: 'UserProfile',

  props: {
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
  },

  setup(props, context) {
    const validationRules = useValidationRules()

    const isShowNewPassword = ref(false)
    const isShowCurrentPassword = ref(false)

    const handleOnInput = (value, path) => context.emit('onUpdateUserProfile', { [path]: value })

    return {
      handleOnInput,
      isShowNewPassword,
      isShowCurrentPassword,
      RULE: validationRules.RULES
    }
  }
})
</script>
