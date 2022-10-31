<template>
  <NodeViewWrapper class="code-block">
    <AskAnnaFlex>
      <select
        ref="languageSelect"
        contenteditable="false"
        :disabled="!isEditable"
        v-model="selectedLanguage"
        class="secondary--text white-text--hover"
      >
        <option :value="null">auto</option>
        <option disabled>—</option>
        <option v-for="(language, index) in languages" :value="language" :key="index">
          {{ language }}
        </option>
      </select>
      <AskAnnaButton
        dark
        icon
        text
        x-small
        color="secondary"
        class="copy-button white-text--hover btn--without-text"
        @click="handleCopy"
        ><AskAnnaIcon>mdi-content-copy</AskAnnaIcon></AskAnnaButton
      >
    </AskAnnaFlex>
    <pre><NodeViewContent as="code"  /></pre>
  </NodeViewWrapper>
</template>

<script lang="ts">
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-2'

export default defineComponent({
  name: 'AskAnnaCodeBlock',

  components: {
    NodeViewWrapper,
    NodeViewContent
  },

  props: nodeViewProps,

  data() {
    return {
      languages: this.extension.options.lowlight.listLanguages()
    }
  },

  computed: {
    isEditable: function () {
      return this.editor.options.editable
    },
    selectedLanguage: {
      get() {
        return this.node.attrs.language || 'plaintext'
      },
      set(language) {
        this.updateAttributes({ language })
      }
    }
  },
  setup() {
    const copy = useCopy()
    const languageSelect = ref(null)

    return { languageSelect, handleCopyText: copy.handleCopyText }
  },

  watch: {
    languageSelect: function (val) {
      if (!val || !this.selectedLanguage) return

      const [language] = this.selectedLanguage.split(' ')
      this.updateAttributes({ language })
    }
  },

  methods: {
    handleCopy() {
      this.handleCopyText(this.node.content.content[0].text)
    }
  }
})
</script>

<style lang="scss" scoped>
.code-block {
  position: relative;

  .copy-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  select {
    color: white;
    position: absolute;
    text-align: right;
    padding-right: 5px;
    top: 0.5rem;
    right: 2.2rem;

    &:not([disabled]) {
      cursor: pointer;
    }
  }
}
</style>
