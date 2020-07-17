<template>
  <v-card px-2 flat>
    <v-card-text class="pb-0 text-left">
      <div class="text--primary">REPLACE THIS CODE PACKAGE</div>

      <div class="text--primary">
        <p>
          If you want to replace this code package, you are in the right place. Below you can find instructions on how
          you can use the AskAnna CLI (<code class="px-2 mr-2 text-primary">{{ cliInstall }}</code>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn x-small v-on="on" outlined color="secondary" @click.stop="handleCopy(cliInstall)">
                <v-icon small color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
          ) to push a new version of the code to this project.
        </p>
        <p>
          Also, you can drag &amp; drop a zip file to this screen. You can make a zip file of your local directory and
          upload this file to AskAnna.
        </p>
        <div>COMMAND LINE INSTRUCTIONS</div>
        <p>
          If you have installed the AskAnna CLI (<code class="px-2 mr-2 text-primary">{{ cliInstall }}</code>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn x-small v-on="on" outlined color="secondary" @click.stop="handleCopy(cliInstall)">
                <v-icon small color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
          ), you can use the command line interface.
        </p>
        <p>
          Probably you already have an <span class="font-italic">askanna.yml</span> file in your local directory. If
          not, create one. The AskAnna CLI will look for this file. The directory where you put the
          <span class="font-italic">askanna.yml</span> file is the main directory. Every content in this directory,
          including subdirectories, will be pushed to AskAnna.
        </p>
        <p>
          In the <span class="font-italic">askanna.yml</span>, you add the next line. Adding this line is the only
          configuration you need to do.
        </p>
        <p>
          <code class="px-2 mr-2 text-primary">{{ projectUrl }}</code>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn x-small v-on="on" outlined color="secondary" @click.stop="handleCopy(projectUrl)">
                <v-icon small color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </p>
        <p>
          In your terminal, make sure you are in one of the project directories. Now you can run
          <code class="px-2 mr-2">{{ askannaPush }}</code>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" x-small outlined color="secondary" @click.stop="handleCopy(askannaPush)">
                <v-icon small color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
          and follow the instructions in the terminal. If you don’t want to confirm that you want to replace the current
          package version, you can use <code class="px-2 mr-2">{{ askannaPushForce }}</code>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" x-small outlined color="secondary" @click.stop="handleCopy(askannaPushForce)">
                <v-icon small color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { url } from '@/core/services/api-settings'
import { ref, defineComponent } from '@vue/composition-api'
import useSnackBar from '@/core/components/snackBar/useSnackBar'

export default defineComponent({
  name: 'ReplaceInfo',

  props: {
    projectShortUuid: {
      type: String,
      default: () => ''
    },
    workspaceId: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const snackBar = useSnackBar()

    const projectUrl = ref(`push-target: ${url}/${props.workspaceId}/project/${props.projectShortUuid}`)
    const cliInstall = 'pip install askanna'
    const askannaPush = 'askanna push'
    const askannaPushForce = 'askanna push -f'

    const handleCopy = text => {
      context.root.$copyText(text).then(
        () => snackBar.showSnackBar({ message: 'Copied', color: 'success' }),
        () => snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
      )
    }

    return {
      projectUrl,
      cliInstall,
      handleCopy,
      askannaPush,
      askannaPushForce
    }
  }
})
</script>
<style>
.askanna-code {
  height: 34px;
  line-height: 34px;
}
</style>
