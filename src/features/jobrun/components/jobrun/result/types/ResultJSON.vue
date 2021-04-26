<template>
  <the-highlight readonly languageName="json" :value="dataSource" v-scroll:#scroll-target="handleOnScroll" />
</template>

<script>
import { throttle } from 'lodash'
import { ref, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ResultHTML',

  props: {
    dataSource: {
      type: String,
      default: function () {
        return ''
      }
    }
  },

  setup() {
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

    return {
      handleOnScroll
    }
  }
})
</script>
