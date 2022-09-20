<template>
  <TheHighlight readonly :languageName="languageName" :value="fileSource" v-scroll:#scroll-target="handleOnScroll" />
</template>

<script setup lang="ts">
import { throttle } from 'lodash'

const props = defineProps({
  fileSource: {
    type: String,
    default: () => ''
  },
  fileExtension: {
    type: String,
    default: () => 'json'
  }
})

const allowedLangs = ['json', 'md', 'py', 'txt', 'yml', 'ini', 'toml', 'markdown']

const currentScrollTop = ref(0)

const onScroll = (scrollTop: number) => {
  if (scrollTop > currentScrollTop.value) {
    window.scrollTo(0, window.pageYOffset + 10)
    currentScrollTop.value = scrollTop
  }
}

const throttled = throttle(onScroll, 1500)

const languageName = computed(() => (allowedLangs.includes(props.fileExtension) ? props.fileExtension : 'markdown'))

const handleOnScroll = (e: Event) => {
  window.scrollTo(0, window.pageYOffset + 10)
  throttled(e?.target?.scrollTop)
}
</script>
