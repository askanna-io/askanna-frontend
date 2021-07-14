<template>
  <div>
    {{ text }}: <template v-if="!isLoading">{{ value }}</template
    ><ask-anna-loading-dots-flashing inline v-else />
  </div>
</template>
<script>
import { ref, watchEffect, defineComponent } from '@vue/composition-api'
import AskAnnaLoadingDotsFlashing from '@/core/components/shared/AskAnnaLoadingDotsFlashing'

export default defineComponent({
  name: 'JobRunInfoText',

  components: {
    AskAnnaLoadingDotsFlashing
  },

  props: {
    text: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: true
    },
    value: {
      type: String | Number,
      default: ''
    }
  },

  setup(props) {
    const isLoading = ref(true)

    watchEffect(() => {
      if (!props.loading) {
        setTimeout(() => (isLoading.value = false), 500)
      }
    })

    return { isLoading }
  }
})
</script>
