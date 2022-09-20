<template>
  <pre
    ref="codeWrapper"
    class="ask-anna-highlight"
  ><code class="lang-shell hljs" :class="{ 'loading': loading }" v-html="highlighted"/></pre>
</template>

<script setup lang="ts">
import hljs from 'highlight.js'

window.hljs = hljs

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  value: {
    type: String,
    default: () => ''
  },
  languageName: {
    type: String,
    default: 'shell'
  },
  maxRowToShow: {
    type: Number || null,
    default: null
  }
})

const codeWrapper = ref(null)
const lineNumber = useLineNumber()

const highlighted = computed(() => {
  let result = hljs.highlight(props.value, { language: props.languageName, ignoreIllegals: true }).value
  result = lineNumber.lineNumbersValue(result, { maxRowToShow: props.maxRowToShow })

  return result
})
</script>
