<template>
  <div class="pt-2 px-1">
    <template v-if="view === 'pretty'">
      <v-alert :value="alert" type="error" dense class="ma-1 pa-0">
        <template slot="prepend">
          <v-icon class="pl-2">mdi-alert</v-icon>
        </template>
        <v-row align="center" class="ma-0 pa-0">
          <v-col class="grow">
            By default, we block JavaScript for security reasons. To continue to run JavaScript at your own risk, please
            press the allow button.
          </v-col>
          <v-col class="shrink">
            <v-btn @click="handleAllow" outlined small>Allow JavaScript</v-btn>
          </v-col>
        </v-row>
      </v-alert>
      <div ref="iframeRef" />
    </template>
    <TheHighlight
      v-else
      readonly
      languageName="html"
      :value="fileSource.slice(0, 10000)"
      v-scroll:#scroll-target="handleOnScroll"
    />
  </div>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const props = defineProps({
  view: {
    type: String,
    default: () => 'pretty'
  },
  fileSource: {
    type: String,
    default: () => ''
  },
  maxHeight: {
    type: String,
    default: () => '100vh'
  }
})

const NOT_ALLOWED_TAGS = ['<script']

const alert = ref(false)
const iframeRef = ref(null)
const currentScrollTop = ref(0)

const source = computed(() => props.fileSource)

const onScroll = scrollTop => {
  if (scrollTop > currentScrollTop.value) {
    window.scrollTo(0, window.pageYOffset + 10)
    currentScrollTop.value = scrollTop
  }
}

const throttled = throttle(onScroll, 1500)

const handleOnScroll = e => {
  window.scrollTo(0, window.pageYOffset + 10)
  throttled(e.target.scrollTop)
}

const handleAllow = () => {
  alert.value = false

  initIframe()
}

const removeIframe = () => {
  while (iframeRef.value && iframeRef.value.firstChild) {
    iframeRef.value.removeChild(iframeRef.value.firstChild)
  }
}

const initIframe = () => {
  removeIframe()
  const sandbox = alert.value ? '' : 'allow-scripts allow-same-origin'

  const iframeEl = document.createElement('iframe')
  iframeEl.setAttribute('height', props.maxHeight)

  iframeEl.setAttribute('class', 'AskAnna-iframe')
  iframeEl.setAttribute('srcdoc', props.fileSource)
  iframeEl.setAttribute('sandbox', sandbox)

  iframeEl.onload = () => {
    if (!alert.value) {
      iframeEl.contentWindow.onscroll = e => handleOnScroll(e)
    }
  }
  iframeRef.value && iframeRef.value.appendChild(iframeEl)
}

watch([iframeRef, source], async iframeRef => {
  if (!source.value || !iframeRef) return

  alert.value = NOT_ALLOWED_TAGS.some(item => props.fileSource.includes(item))
  initIframe()
})
</script>
<style>
.AskAnna-iframe {
  border: none;
  width: 100%;
}
</style>
