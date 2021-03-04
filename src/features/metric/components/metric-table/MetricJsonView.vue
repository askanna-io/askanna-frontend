<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pb-0 pt-0">
      <div class="page">
        <div>
          <the-highlight v-if="jsonString" :value="jsonString" languageName="json" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import TheHighlight from '@/core/components/highlight/TheHighlight'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'MetricJsonView',

  components: {
    TheHighlight
  },

  props: {
    jsonString: String
  }
})
</script>
