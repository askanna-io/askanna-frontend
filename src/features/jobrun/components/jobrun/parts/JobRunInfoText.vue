<template>
  <div>
    <span class="font-weight-bold">{{ text }}:</span>
    &nbsp;<template v-if="!isLoading">{{ value }}</template
    ><ask-anna-loading-dots-flashing inline v-else />
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from '@vue/composition-api'
import AskAnnaLoadingDotsFlashing from '@/core/components/shared/AskAnnaLoadingDotsFlashing'

const props = defineProps({
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
})

const isLoading = ref(true)

watchEffect(() => {
  if (!props.loading) {
    setTimeout(() => (isLoading.value = false), 500)
  }
})
</script>
