<template>
  <v-tooltip top content-class="opacity-1">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <template v-if="text">{{ text }}: </template><ask-anna-chip-status :status="value" />
      </div>
    </template>
    Status of the run
  </v-tooltip>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
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
