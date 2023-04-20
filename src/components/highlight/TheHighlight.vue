<template>
  <pre
    ref="codeWrapper"
    class="ask-anna-highlight w-full"
  ><code class="lang-shell hljs" :class="{ 'loading': loading }" v-html="highlighted"/></pre>
</template>

<script setup lang="ts">
import hljs from 'highlight.js'

const props = defineProps({
  singleLine: {
    type: Boolean,
    default: false
  },
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
const hljsWithLineNumber = useLineNumber(hljs)

const highlighted = computed(() => {
  let result = hljsWithLineNumber.highlight(props.value, { language: props.languageName, ignoreIllegals: true }).value
  result = hljsWithLineNumber.lineNumbersValue(result, {
    maxRowToShow: props.maxRowToShow,
    singleLine: props.singleLine
  })

  return result
})
</script>
