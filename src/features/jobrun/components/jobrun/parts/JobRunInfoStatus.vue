<template>
  <div>{{ text }}: <ask-anna-chip-status :status="value" /></div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
import AskAnnaChipStatus from '@/core/components/shared/AskAnnaChipStatus.vue'

export default defineComponent({
  name: 'JobRunInfoStatus',

  components: { AskAnnaChipStatus },

  props: {
    text: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  }
})
</script>
