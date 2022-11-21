<template>
  <AskAnnaCard px-2 flat>
    <AskAnnaCardText class="pb-0 text-left">
      <div class="text--primary">REPLACE THIS CODE PACKAGE</div>

      <div class="text--primary">
        <p>
          If you want to replace this code package, you are in the right place. Below you can find instructions on how
          you can use the AskAnna CLI ( <AskAnnaCopyText :text="cliInstall" />
          ) to push a new version of the code to this project.
        </p>
        <p>
          Also, you can drag &amp; drop a zip file to this screen. You can make a zip file of your local directory and
          upload this file to AskAnna.
        </p>
        <div>COMMAND LINE INSTRUCTIONS</div>
        <p>
          If you have installed the AskAnna CLI ( <AskAnnaCopyText :text="cliInstall" />), you can use the command line
          interface as well.
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
          <AskAnnaCopyText :text="projectUrl" />
        </p>
        <p>
          In your terminal, make sure you are in one of the project directories. Now you can run
          <AskAnnaCopyText :text="askannaPush" />
          and follow the instructions in the terminal. If you don’t want to confirm that you want to replace the current
          package version, you can use <AskAnnaCopyText :text="askannaPushForce" />
        </p>
        <p>
          Optionally you can add a description to the version you push via
          <AskAnnaCopyText :text="askannaPushWithMessage" />
        </p>
      </div>
    </AskAnnaCardText>
  </AskAnnaCard>
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
const askannaPushWithMessage = 'askanna push -m "a description"'

const projectUrl = ref(`push-target: ${url}/${props.workspaceId}/project/${props.projectShortUuid}`)
</script>
<style>
.askanna-code {
  height: 34px;
  line-height: 34px;
}
</style>
