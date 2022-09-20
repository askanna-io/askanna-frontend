<template>
  <v-card px-2 flat>
    <v-card-text class="pb-0 text-left">
      <div class="text--primary">
        <p>
          There is no code pushed to this project. Below you can find instructions on how you can use the AskAnna CLI (
          <ask-anna-copy-text :text="cliInstall" />
          ) to push code to this project.
        </p>
        <p>
          Also, you can drag &amp; drop a zip file to this screen. You can make a zip file of your local directory and
          upload this file to AskAnna.
        </p>
        <div>COMMAND LINE INSTRUCTIONS</div>
        <p>
          If you have installed the AskAnna CLI (<ask-anna-copy-text :text="cliInstall" />
          ), you can use the command line interface as well.
        </p>
        <p>
          First, add an <span class="font-italic">askanna.yml</span> file to your local directory. The AskAnna CLI will
          look for this file. The directory where you put the <span class="font-italic">askanna.yml</span> file is the
          main directory. Every content in this directory, including subdirectories, will be pushed to AskAnna.
        </p>

        <p>
          In the <span class="font-italic">askanna.yml</span>, you add the next line. Adding this line is the only
          configuration you need to do. Or you can download<v-tooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" class="ml-1" x-small outlined color="secondary" @click.stop="handleDownload">
                <v-icon small color="secondary">mdi-download</v-icon>
              </v-btn>
            </template>
            <span>Download <i>askanna.yml</i></span>
          </v-tooltip>
          and use this <span class="font-italic">askanna.yml</span> file.
        </p>
        <p>
          <ask-anna-copy-text :text="projectUrl" />
        </p>
        <p>
          In your terminal, make sure you are in one of the project directories. Now you can run
          <ask-anna-copy-text :text="askannaPush" />
          and follow the instructions in the terminal. If you don’t want to confirm every time you push a file, you can
          use <ask-anna-copy-text :text="askannaPushForce" />
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { url } from '@/services/api-settings'
const props = defineProps({
  projectShortUuid: {
    type: String,
    default: () => ''
  },
  workspaceId: {
    type: String,
    default: () => ''
  }
})

const askannaPush = 'askanna push'
const cliInstall = 'pip install askanna'
const askannaPushForce = 'askanna push -f'

const forceFileDownload = useForceFileDownload()

const projectUrl = ref(`push-target: ${url}/${props.workspaceId}/project/${props.projectShortUuid}`)

const handleDownload = async () => {
  forceFileDownload.trigger({ source: projectUrl.value, name: 'askanna.yml' })
}
</script>
<style>
.askanna-code {
  height: 34px;
  line-height: 34px;
}
</style>
