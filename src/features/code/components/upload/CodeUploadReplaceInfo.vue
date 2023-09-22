<template>
  <AskAnnaCard variant="flat">
    <AskAnnaCardText class="text-left askanna--editor prose max-w-none">
      <p>
        If you want to replace this code package, you are in the right place.
      </p>
      <p>
        You can create a zip file from your local directory and upload this file to AskAnna. To upload the zip file you
        can either drag &amp; drop the file to this screen or click the upload button below.
      </p>
      <p>
        Also, you can use the AskAnna CLI to push code:
      </p>
      <AskAnnaDescription
        readonly
        isCodeBlcok
        class="not-prose"
        :description="askannaPush"
        :class="{ 'py-0 pl-2 ': $vuetify.display.xs }"
      />

      <p>
        More information about pushing code using the AskAnna CLI is in <a
          href="https://docs.askanna.io/code/?h=askanna.yml#askannayml"
          target="_blank"
        >the documentation</a>.
      </p>
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

const askannaPush = '<pre data-node-language="bash"><code class="language-bash">askanna push --description "An optional description"</code></pre>'
</script>