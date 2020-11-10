<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, value }">
      <div v-on="on">
        <v-btn class="px-0" text small>{{ prefix }}{{ text.slice(0, show) }}</v-btn>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn icon text x-small v-on="on" v-show="value" @click.stop="handleCopy(text)"
              ><v-icon>mdi-content-copy</v-icon></v-btn
            >
          </template>
          <span>Copy</span>
        </v-tooltip>
      </div>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
import useCopy from '@/core/composition/useCopy'
import { defineComponent } from '@vue/composition-api'
import useSnackBar from '@/core/components/snackBar/useSnackBar'

export default defineComponent({
  name: 'AskAnnaCopy',

  props: {
    text: {
      type: String,
      default: () => ''
    },
    prefix: {
      type: String,
      default: () => ''
    },
    show: {
      type: Number,
      default: () => 4
    }
  },

  setup(props, context) {
    const copy = useCopy(context)
    const snackBar = useSnackBar()

    return { handleCopy: copy.handleCopyText }
  }
})
</script>
<style scoped>
.ask-anna-copy-text code {
  color: white;
}
</style>
