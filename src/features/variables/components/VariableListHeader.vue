<template>
  <div>
    <v-card flat>
      <v-card-text>
        <p>
          Project variables are applied to every run environment within this project. You can use variables for
          settings, passwords, tokens, etcetera. You can use the variable in your job definition via
          <b>VARIABLE_NAME</b>. Also the variables are avaiable as environment variables, so you can refer directly to
          them via for example you Python script.
        </p>
        <p>
          Masked variables can be used for sensitive information. By default we will not expose the value of these
          variables.
        </p>
        <a
          class="app-link text-decoration-none primary--text font-weight-medium d-inline-block"
          href="https://docs.askanna.io/#/jobs?id=variables"
          target="_blank"
          >Read the documentation for more information.</a
        >
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
