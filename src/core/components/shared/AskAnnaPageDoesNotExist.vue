<template>
  <v-card class="mx-auto" :outlined="outlined" flat>
    <slot name="header" />
    <template v-if="isUserLoggedIn">
      <v-divider />

      <v-card-title>
        <span class="title font-weight-light">Oops...we cannot find this {{ pageTitle }}</span>
      </v-card-title>

      <v-card-text>
        <p>
          We cannot find the {{ pageTitle }} you just tried to open. Maybe the {{ pageTitle }} is removed, or you don't
          have access to open the {{ pageTitle }} (anymore). For support you can always check with your team, or reach
          out to us on <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
        </p>
      </v-card-text>
    </template>
    <template v-else>
      <v-card-title>
        <span class="title font-weight-light">Oops...no access, or the {{ pageTitle }} does not exist</span>
      </v-card-title>

      <v-card-text>
        <p>
          You cannot open the {{ pageTitle }}. This can mean you don't have access, or that the {{ pageTitle }} does not
          exist. You can try to sign in.
        </p>
      </v-card-text>
      <v-card flat max-width="400" class="px-3 pb-3">
        <v-card-title class="pa-1">Sign in</v-card-title>
        <the-sign-in />
      </v-card>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import TheSignIn from '@/features/auth/components/TheSignIn'

defineProps({
  pageTitle: {
    type: String,
    default: ''
  },
  outlined: {
    type: Boolean,
    default: false
  }
})

const permission = usePermission()

const isUserLoggedIn = computed(() => permission.isUserLoggedIn)
</script>
