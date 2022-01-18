<template>
  <TheHighlight readonly languageName="json" :value="dataSource" v-scroll:#scroll-target="handleOnScroll" />
</template>

<script setup lang="ts">
import { throttle } from 'lodash'
import { ref } from '@vue/composition-api'
import TheHighlight from '@/core/components/highlight/TheHighlight.vue'

defineProps({
  dataSource: {
    type: String,
    default: function () {
      return ''
    }
  }
})

const currentScrollTop = ref(0)

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
</script>
