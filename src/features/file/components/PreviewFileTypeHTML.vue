<template>
  <div class="pt-2 px-1">
    <template v-if="view === 'pretty'">
      <AskAnnaAlert
        class="m-1"
        type="error"
        density="compact"
        :modelValue="alert"
      >
        <template slot="prepend">
          <AskAnnaIcon class="pl-2">mdi-alert</AskAnnaIcon>
        </template>
        <div class="flex items-center">
          <div class="flex grow">
            By default, we block JavaScript for security reasons. To continue to run JavaScript at your own risk, please
            press the allow button.
          </div>
          <div class="shrink">
            <AskAnnaButton @click="handleAllow">Allow JavaScript</AskAnnaButton>
          </div>
        </div>
      </AskAnnaAlert>
      <div
        class="h-screen"
        ref="iframeRef"
      />
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
    default: () => '100%'
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

  iframeEl.setAttribute('class', 'askanna-iframe')
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
.askanna-iframe {
  border: none;
  width: 100%;
}
</style>