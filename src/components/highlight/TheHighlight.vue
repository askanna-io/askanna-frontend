<template>
  <pre
    ref="codeWrapper"
    class="askanna-highlight whitespace-normal w-full"
  >
      <code class="lang-shell hljs p-3" :class="{ 'loading': loading, 'rounded-b': roundedBottom }" v-html="highlighted"></code>
    </pre>
</template>

<script setup lang="ts">

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
  },
  roundedBottom: {
    type: Boolean,
    default: false
  },
})

const hljsWithLineNumber = useLineNumber()

const highlighted = computed(() => {
  let result = hljsWithLineNumber.highlight(props.value, { language: props.languageName, ignoreIllegals: true }).value
  result = hljsWithLineNumber.lineNumbersValue(result, { maxRowToShow: props.maxRowToShow, singleLine: props.singleLine })

  return result
})
</script>