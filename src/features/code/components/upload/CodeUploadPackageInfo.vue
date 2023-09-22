<template>
  <AskAnnaCard variant="flat">
    <AskAnnaCardText class="text-left askanna--editor prose max-w-none">
      <p>
        No code has been pushed to this project yet. Below are instructions for using the AskAnna CLI to
        push code to this project.
      </p>
      <p>
        You can also create a zip file from your local directory and upload this file to AskAnna. To upload the zip file
        you
        can either drag &amp; drop the file to this screen or click the upload button below.
      </p>
      <AskAnnaCardTitle class="px-0">AskAnna CLI</AskAnnaCardTitle>
      <p class="mt-0">
        Make sure the AskAnna CLI is installed and that you are logged in:
      </p>
      <AskAnnaDescription
        readonly
        isCodeBlcok
        class="not-prose"
        :description="pipInstallText"
        :class="{ 'py-0 pl-2 ': $vuetify.display.xs }"
      />
      <p>
        Next, add an askanna.yml file to your local directory. The directory where you put the askanna.yml file is the
        project's root directory. All content in this directory, including subdirectories, will be pushed to AskAnna.
      </p>
      <p>
        In the askanna.yml, add the following line.
      </p>
      <AskAnnaDescription
        readonly
        isCodeBlcok
        :description="projectUrl"
        class="curl-code not-prose m-0 p-0"
      />
      <p>
        You can also<a
          class="ml-1 cursor-pointer"
          size='x-small'
          variant="text"
          @click.stop="handleDownload"
        >download and use this askanna.yml file<AskAnnaTooltip>
            <span>Download <i>askanna.yml</i></span>
          </AskAnnaTooltip>
        </a>. More information about the project configuration can be found in <a
          href="https://docs.askanna.io/code/?h=askanna.yml#askannayml"
          target="_blank"
        >the documentation</a>.

      </p>
      <p>Finally, in your terminal ensure you are in the project directory. Now you can push the code to AskAnna: </p>
      <AskAnnaDescription
        readonly
        isCodeBlcok
        :description="askannaPush"
        class="curl-code not-prose m-0 p-0"
      />
    </AskAnnaCardText>
  </AskAnnaCard>
</template>
<script setup lang="ts">
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

const askannaPush = '<pre data-node-language="bash"><code class="language-bash">askanna push</code></pre>'
const pipInstallText = `<pre data-node-language="bash"><code class="language-bash">pip install askanna
askanna login --url ${location.origin}</code></pre>`

const forceFileDownload = useForceFileDownload()

const projectUrl = ref(`<pre data-node-language="bash"><code class="language-bash">push-target: ${location.origin}/${props.workspaceId}/project/${props.projectShortUuid}</code></pre>`)

const handleDownload = async () => {
  forceFileDownload.trigger({ source: projectUrl.value, name: 'askanna.yml' })
}
</script>
