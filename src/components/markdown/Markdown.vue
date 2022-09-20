<template>
  <div class="ask-anna-highlight markdown-body">
    <div ref="markdownRef" v-html="md"></div>
  </div>
</template>
<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import MarkdownItIns from 'markdown-it-ins'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItMdi from 'markdown-it-mdi'
import MarkdownItSup from 'markdown-it-sup'
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItAbbr from 'markdown-it-abbr'
import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItIcons from 'markdown-it-icons'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItDeflist from 'markdown-it-deflist'
import MarkdownItTOC from 'markdown-it-toc-done-right'
import MarkdownItTasklists from 'markdown-it-task-lists'
import MarkdownItLinkAttributes from 'markdown-it-link-attributes'

import hljs from 'highlight.js'
import { escape, unescape, lowerCase } from 'lodash'

const props = defineProps({
  breaks: {
    type: Boolean,
    default: false
  },

  highlight: {
    type: Object,
    default: () => ({
      inline: true
    })
  },
  html: {
    type: Boolean,
    default: false
  },
  langPrefix: {
    type: String,
    default: 'language-'
  },
  linkify: {
    type: Boolean,
    default: false
  },
  quotes: {
    type: String,
    default: '“”‘’'
  },
  source: {
    type: String,
    default: ''
  },
  tasklists: {
    type: Object,
    default: () => ({
      enabled: true
    })
  },
  toc: {
    type: Object,
    default: () => ({})
  },
  typographer: {
    type: Boolean,
    default: false
  },
  xhtmlOut: {
    type: Boolean,
    default: false
  },
  images: {
    type: Array,
    default: () => []
  },
  cdnBaseUrl: {
    type: String,
    default: () => ''
  }
})

const copy = useCopy()
const { route } = useRouterAskAnna()

const sourceComputed = computed(() => props.source)

const md = ref()
const previous = ref('')
const markdownRef = ref()
const listenerSet = ref(false)

const renderMarkdown = () => {
  let markdown = new MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            `<div class="flex code-wrapper"><span class="code-lang-absolute">${lang}</span><button type="button" data-clipboard-text="${escape(
              str
            )}" class="markdown-copy-btn white-text--hover btn--without-text v-btn v-btn--icon v-btn--round v-btn--text theme--dark v-size--x-small secondary--text"><span class="v-btn__content"><i  aria-hidden="true" class="v-icon notranslate mdi mdi-content-copy theme--dark"></i></span></button><pre class="hljs as"><code>` +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre></div>'
          )
        } catch (__) {}
      }

      return '<pre class="hljs"><code>' + markdown.utils.escapeHtml(str) + '</code></pre>'
    }
  })
    .use(MarkdownItAbbr)
    .use(MarkdownItAnchor)
    .use(MarkdownItDeflist)
    .use(MarkdownItEmoji)
    .use(MarkdownItMdi)
    .use(MarkdownItIns)
    .use(MarkdownItMark)
    .use(MarkdownItSub)
    .use(MarkdownItSup)
    .use(MarkdownItTasklists, props.tasklists)
    .use(MarkdownItTOC, props.toc)
    .use(import.meta.env.DEV ? MarkdownItIcons : MarkdownItIcons.default, 'emoji')
    .use(import.meta.env.DEV ? MarkdownItIcons : MarkdownItIcons.default, 'font-awesome')
    .use(MarkdownItLinkAttributes, {
      matcher(href: string) {
        return !href.includes(window.location.origin)
      },
      attrs: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    })

    .set({
      breaks: props.breaks,
      html: props.html,
      langPrefix: props.langPrefix,
      linkify: props.linkify,
      quotes: props.quotes,
      typographer: props.typographer,
      xhtmlOut: props.xhtmlOut
    })

  // add support packages images
  // it looks by path in package items
  const defaultRender = markdown.renderer.rules.image
  const imageSrc = /^https?:\/\/(www\.)?.*\/(\d+)($|\/)/

  markdown.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const aIndex = token.attrIndex('src')
    const imgPath = token.attrs[aIndex][1]

    if (!imageSrc.test(imgPath)) {
      const imageData = props.images.find(img => img.path === imgPath)
      if (!imageData) return

      return `<img class="embed-responsive" src="${props.cdnBaseUrl}/${imageData.path}" alt="${imageData.name}"/>`
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }

  md.value = markdown.render(sourceComputed.value)
}

const findUpTag = (el, tag: string) => {
  while (el.parentNode) {
    el = el.parentNode
    if (lowerCase(el.tagName) === tag) return el
  }
  return null
}

const copyCode = e => {
  const btn = findUpTag(e.srcElement, 'button')
  if (!btn) return
  copy.handleCopyText(unescape(btn.getAttribute('data-clipboard-text')))
}

const scrollToEl = (hash: string) => {
  if (!hash) return

  const correction = route.name === 'workspace-project-code' ? 10 : 50
  try {
    const h = document.querySelector(hash)

    window.scrollTo({
      left: 0,
      behavior: 'smooth',
      top: h.offsetParent.offsetTop + h.offsetTop - correction
    })
  } catch {}
}

const copyBtns = () => {
  //set anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      scrollToEl(this.getAttribute('href'))
    })
  })

  const btns = document.querySelectorAll('.markdown-copy-btn')

  if (!btns.length || listenerSet.value) return
  btns.forEach(element => {
    element?.addEventListener('click', copyCode)
  })
  listenerSet.value = true
}

onUpdated(() => copyBtns())
onMounted(() => copyBtns())

watchEffect(() => {
  if (!props.source || previous.value === props.source) {
    return
  }
  previous.value = props.source
  renderMarkdown()
})

watch(markdownRef, () => {
  //check if url has anchor
  const hash = route.hash

  setTimeout(scrollToEl, 1000, hash)
})
</script>
<style lang="scss">
@import './mardown.scss';
.code-lang-absolute {
  position: absolute;
  text-align: right;
  padding-right: 5px;
  top: 0.5rem;
  right: 2.2rem;
  color: #515151;
  font-weight: normal;
  font-size: 16px;
}
.code-wrapper {
  position: relative;
  font-family: Roboto, sans-serif !important;
}
.markdown-copy-btn {
  position: absolute !important;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
