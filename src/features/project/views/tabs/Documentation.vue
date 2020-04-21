<template>
  <v-card flat class="mx-3 mt-2" outlined>
    <v-card-title class="headline font-weight-bold">
      Command line instructions
    </v-card-title>
    <v-card-text>
      <p>
        You can work on your project via the AskAnna CLI. With the CLI you can package your code and deploy to AskAnna.
      </p>
    </v-card-text>
    <v-card-title class="headline font-weight-bold">
      Download the CLI
    </v-card-title>
    <v-card-text>
      <p>
        When working in a virtualenv (python), one can install the CLI using:
        <br />
        <code>pip install git+https://gitlab.askanna.io/askanna/askanna-cli.git#egg=askanna-cli</code>
      </p>
      <p>
        Once installed the following steps can be taken to setup your project.
        <br />
        <code>askanna login</code>
      </p>
      <p>
        Login with your username and password.
        <br />
        <code>askanna createproject</code>
      </p>
      <p>
        Answer the questions to have your project created. <br />
        Lastly, edit the `askanna.yml` in the project folder.<br />
        Look for the value `project_url` and replace the value with: <br />
        ***REPLACE_WITH_CURRENT_PROJECT_URL**
        <br />e.g.:
        <br />
        <br />
        <code>project_url: https://askanna.io/mycompany/projectx</code>
      </p>
    </v-card-text>
    <v-card-title class="headline font-weight-bold">
      Further reference
    </v-card-title>
    <v-card-text>
      <p>
        The CLI is using our API which facilitates many operations such as running a job. If you would like know what
        our API offers, you can go to <br />
        <a href="https://askanna.eu/api/v1">https://askanna.eu/api/v1</a>
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Documentation'
})
</script>
