<template>
  <NodeViewWrapper class="code-block">
    <div class="flex">
      <select
        v-if="isEditable"
        ref="languageSelect"
        contenteditable="false"
        :disabled="!isEditable"
        v-model="selectedLanguage"
        class="text-secondary hover:text-white"
      >
        <option :value="null">auto</option>
        <option disabled>—</option>
        <option
          v-for="(language, index) in languages"
          :key="index"
          :value="language"
        >
          {{ language }}
        </option>
      </select>
      <VHover>
        <template v-slot:default="{ isHovering }">
          <AskAnnaButton
            variant="text"
            size="x-small"
            class="copy-button"
            @click="handleCopy"
            icon="mdi-content-copy"
            classIcon="group-hover/button:text-white group/button:text-secondary"
          >
            <AskAnnaTooltip>
              Copy code
            </AskAnnaTooltip>
          </AskAnnaButton>
        </template>

      </VHover>
    </div>
    <pre><NodeViewContent as="code"  /></pre>
  </NodeViewWrapper>
</template>

<script lang="ts">
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'

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
      this.handleCopyText(this.node.content.content[0]?.text || '')
    }
  }
})
</script>

<style lang="scss" scoped>
.code-block {
  position: relative;

  .copy-button {
    position: absolute;
    top: 0.3rem;
    right: 0.5rem;
  }

  select {
    color: white;
    position: absolute;
    text-align: right;
    padding-right: 5px;
    top: 0.5rem;
    right: 2.2rem;

    background-position: calc(100% - 0.75rem) center !important;
    -moz-appearance: none !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    padding-right: 2rem !important;

    &:not([disabled]) {
      cursor: pointer;
    }
  }
}
</style>