<template>
  <ask-anna-page-does-not-exist pageTitle="package" />
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import AskAnnaPageDoesNotExist from '@/core/components/shared/AskAnnaPageDoesNotExist'

export default defineComponent({
  name: 'code-does-not-exist',

  components: {
    AskAnnaPageDoesNotExist
  }
})
</script>
