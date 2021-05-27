<template>
  <div>
    {{ text }}: <a @click="handleGotoCode"> {{ value }}</a>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

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

  setup(_, context) {
    const router = useRouterAskAnna(context)

    const handleGotoCode = () => {
      router.push({
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
