<template>
  <v-card class="mx-auto" :outlined="outlined" flat>
    <slot name="header" />
    <v-divider />
    <v-card-title>
      <span class="title font-weight-light">Oops...you cannot see this {{ pageTitle }}</span>
    </v-card-title>

    <v-card-text>
      <p>
        You cannot see the {{ pageTitle }} you just tried to open. Maybe the {{ pageTitle }} is removed, or you don't
        have access to open the {{ pageTitle }} (anymore). For support you can always check with your team, or reach out
        to us on <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaForbiddenPage',

  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    outlined: {
      type: Boolean,
      default: false
    }
  }
})
</script>
