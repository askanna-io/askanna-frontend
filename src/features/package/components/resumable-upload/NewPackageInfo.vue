<template>
  <v-card px-2 flat>
    <v-card-text class="pb-0 text-left">
      <div class="text--primary">
        <p>
          There is no code pushed to this project. Below you can find instructions on how you can use the AskAnna CLI
          (<code class="px-2 mr-2 text-primary">{{ cliInstall }}</code>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn x-small v-on="on" outlined color="secondary" @click.stop="handleCopy(cliInstall)">
                <v-icon small color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
          ) to push code to this project.
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
          ), you can use the command line interface as well.
        </p>
        <p>
          First, add an <span class="font-italic">askanna.yml</span> file to your local directory. The AskAnna CLI will
          look for this file. The directory where you put the <span class="font-italic">askanna.yml</span> file is the
          main directory. Every content in this directory, including subdirectories, will be pushed to AskAnna.
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
          and follow the instructions in the terminal. If you don’t want to confirm every time you push a file, you can
          use <code class="px-2 mr-2">{{ askannaPushForce }}</code>
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
  name: 'NewPackageInfo',

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
    const askannaPushWithMessage = 'askanna push -m "a description"'

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
      askannaPushForce,
      askannaPushWithMessage
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
