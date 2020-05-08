<template>
  <div>
    {{ text }}: <a @click="handleGotoJob"> {{ value }}</a>
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
  },

  setup(props, context) {
    const handleGotoJob = () => {
      context.root.$router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params }
      })
    }

    return {
      handleGotoJob
    }
  }
})
</script>
