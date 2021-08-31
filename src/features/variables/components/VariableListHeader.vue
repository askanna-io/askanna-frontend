<template>
  <div>
    <v-card flat>
      <v-card-text>
        <p>
          Project variables are applied to every run environment within this project. You can use variables for
          settings, passwords, tokens, etcetera. Masked variables can be used for sensitive information.
          <a
            class="app-link text-decoration-none primary--text font-weight-medium d-inline-block"
            href="https://docs.askanna.io/variables/"
            target="_blank"
          >
            Read the documentation</a
          >
          for more information about how you can use variables in the job definition and project code.
        </p>
      </v-card-text>
    </v-card>
    <v-toolbar color="grey lighten-4" flat dense>
      <v-spacer />
      <v-btn @click="handleOpenVariablePopup()" small rounded class="mr-3">
        <v-icon color="primary" left>mdi-plus</v-icon>
        New variable
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'VariableListHeader',

  setup(props, context) {
    const handleOpenVariablePopup = () => context.emit('openVariablePopup')

    return {
      handleOpenVariablePopup
    }
  }
})
</script>
