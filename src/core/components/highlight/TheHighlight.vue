<template>
  <pre ref="codeWrapper" class="ask-anna-highlight"><code class="lang-shell hljs" v-html="highlighted"></code></pre>
</template>

<script>
import hljs from 'highlight.js'
import useLineNumber from './useLineNumber'
import { ref, computed, defineComponent } from '@vue/composition-api'
window.hljs = hljs

export default defineComponent({
  name: 'TheHighlight',

  props: {
    value: String
  },

  setup(props, context) {
    const codeWrapper = ref(null)
    const lineNumber = useLineNumber()

    const highlighted = computed(() => {
      let result = hljs.highlight('shell', props.value, true).value
      result = lineNumber.lineNumbersValue(result)

      return result
    })

    return {
      codeWrapper,
      highlighted
    }
  }
})
</script>

<style>
/*

Atom One Dark by Daniel Gamage
Original One Dark Syntax theme from https://github.com/atom/one-dark-syntax

base:    #282c34
mono-1:  #abb2bf
mono-2:  #818896
mono-3:  #5c6370
hue-1:   #56b6c2
hue-2:   #61aeee
hue-3:   #c678dd
hue-4:   #98c379
hue-5:   #e06c75
hue-5-2: #be5046
hue-6:   #d19a66
hue-6-2: #e6c07b

*/
.hljs-ln td {
  padding: 0;
}
.hljs-ln {
  border-collapse: collapse;
  line-height: 8px;
}
.hljs-ln-n:before {
  content: attr(data-line-number);
}
/* for block of numbers */
.hljs-ln-numbers {
  font-size: 14px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-align: right;
  color: #999;
  vertical-align: top;
  padding-left: 5px !important;
  padding-right: 5px !important;
}
/* for block of code */
.hljs-ln-code {
  white-space: pre-wrap;
  font-size: 14px;
}
.ask-anna-highlight td.hljs-ln-code {
  white-space: pre;
}

.ask-anna-highlight code {
  white-space: pre-wrap;
  overflow: auto;
}
.ask-anna-highlight .hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #999;
  background-color: #282c34 !important;
}

.hljs-comment,
.hljs-quote {
  color: #5c6370;
  font-style: italic;
}

.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  color: #c678dd;
}

.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #e06c75;
}

.hljs-literal {
  color: #56b6c2;
}

.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta-string {
  color: #98c379;
}

.hljs-built_in,
.hljs-class .hljs-title {
  color: #e6c07b;
}

.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #d19a66;
}

.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #61aeee;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

.hljs-link {
  text-decoration: underline;
}
</style>
