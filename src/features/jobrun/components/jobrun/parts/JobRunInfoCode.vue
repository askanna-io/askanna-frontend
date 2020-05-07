<template>
  <div>
    {{ text }}: <a @click="handleGotoCode"> {{ value }}</a>
  </div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfoCode',

  props: {
    text: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const handleGotoCode = () => {
      context.root.$router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params }
      })
    }

    return {
      handleGotoCode
    }
  }
})
</script>
