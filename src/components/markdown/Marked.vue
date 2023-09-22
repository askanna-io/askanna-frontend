<template>
    <div class="askanna-highlight markdown-body">
        <div
            ref="markdownRef"
            v-html="md"
        ></div>
    </div>
</template>
<script setup lang="ts">
import { marked } from 'marked'
import hljs from 'highlight.js'
import { Octokit } from "@octokit/rest"
import { markedEmoji } from "marked-emoji"
import { markedXhtml } from 'marked-xhtml'
import 'marked-admonition-extension/dist/index.css'
import { gfmHeadingId } from "marked-gfm-heading-id"
import { escape, unescape, lowerCase } from 'lodash'
import { markedSmartypants } from "marked-smartypants"
import markedAdmonition, { setConfig } from 'marked-admonition-extension'


const props = defineProps({
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
const octokit = new Octokit()
const { route } = useRouterAskAnna()
const imageSrc = /^https?:\/\/(www\.)?.*\/(\d+)($|\/)/

const md = ref()
const previous = ref('')
const markdownRef = ref()
const listenerSet = ref(false)

const sourceComputed = computed(() => props.source)
const renderer = {
    link(href, title, text) {
        if (!href.includes(window.location.origin)) {
            return `<a target="_blank" href="${href}">${text}</a>`
        }
    },
    code(str, language) {
        if (language && hljs.getLanguage(language)) {
            try {
                return (
                    `<div class="flex code-wrapper"><span class="code-lang-absolute">${language}</span>
             <button type="button" data-clipboard-text="${escape(str)}" class="v-btn markdown-copy-btn v-btn--icon v-theme--AskAnnaLightTheme v-btn--density-default v-btn--size-x-small v-btn--variant-text copy-button group/button min-w-max hover:text-primary copy-button" classicon="group-hover/button:text-white group/button:text-secondary"><span class="v-btn__overlay"></span><span class="v-btn__underlay"></span><!----><span class="v-btn__content" data-no-activator=""><i class="mdi-content-copy mdi v-icon notranslate v-theme--AskAnnaLightTheme v-icon--size-default text-secondary group-hover/button:text-white group/button:text-secondary" aria-hidden="true"></i></span></button>
            <pre class="hljs w-full"><code>` +
                    hljs.highlight(str, { language, ignoreIllegals: true }).value +
                    '</code></pre></div>'
                )
            } catch (__) { }
        }

        return '<pre class="hljs"><code>' + escape(str) + '</code></pre>'
    },
    image(href, title, text) {
        const imgPath = href

        if (!imageSrc.test(imgPath)) {
            const imageData = props.images.find(img => img.path === imgPath)
            if (!imageData) return false

            return `<img class="embed-responsive" src="${props.cdnBaseUrl}/${imageData.path}" alt="${title || text}"/>`
        }

        // pass token to default renderer.
        return false
    }
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
    } catch { }
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

const init = async () => {
    const res = await octokit.rest.emojis.get()
    const emojis = res.data

    marked.use(markedEmoji({
        emojis,
        unicode: false,
    }))

    marked.use(markedAdmonition)
    marked.use(markedXhtml())
    marked.use(markedSmartypants())
    marked.use({ mangle: false, sanitize: false, })
    marked.use(gfmHeadingId())
    marked.use({ renderer })
}

watchEffect(async () => {
    if (!props.source || previous.value === props.source) {
        return
    }
    previous.value = props.source
    await init()
    md.value = marked(sourceComputed.value)
})

onUpdated(() => copyBtns())
onMounted(() => copyBtns())
</script>

<style scope lang="scss">
@import './mardown.scss';

.code-lang-absolute {
    position: absolute;
    text-align: right;
    padding-right: 5px;
    top: 0.3rem;
    right: 2.2rem;
    color: #515151;
    font-weight: normal;
    font-size: 16px;
}

.code-wrapper {
    position: relative;
    font-family: Roboto, sans-serif !important;

    .hljs {
        background-color: #282c34 !important;
        padding: 0.5em;
    }
}

.markdown-copy-btn {
    position: absolute !important;
    top: 0.1rem;
    right: 0.5rem;
}
</style>
