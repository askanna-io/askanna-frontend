<template>
  <div>
    {{ text }}:<v-btn
      color="primary"
      class="px-0 text--capitalize"
      text
      small
      :to="{
        name: 'workspace-project-job-overiew',
        params: { ...$route.params }
      }"
    >
      {{ value }}</v-btn
    >
  </div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfoJob',

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
