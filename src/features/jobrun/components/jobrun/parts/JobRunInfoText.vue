<template>
  <div>{{ text }}: {{ value }}</div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfoText',

  props: {
    text: {
      type: String,
      default: ''
    },
    value: {
      type: String | Number,
      default: ''
    }
  }
})
</script>
