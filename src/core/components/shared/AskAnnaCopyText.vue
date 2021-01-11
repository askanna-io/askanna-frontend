<template>
  <span class="ask-anna-copy-text">
    <code class="px-2 mr-2 primary text--white">{{ text }}</code>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" x-small outlined color="secondary" @click.stop="handleCopy">
          <v-icon small color="secondary">mdi-content-copy</v-icon>
        </v-btn>
      </template>
      <span>Copy</span>
    </v-tooltip>
  </span>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import useSnackBar from '@/core/components/snackBar/useSnackBar'

export default defineComponent({
  name: 'AskAnnaCopyText',

  props: {
    text: {
      type: String,
      default: () => ''
    }
  },

  setup(props, context) {
    const snackBar = useSnackBar()

    const handleCopy = () => {
      context.root.$copyText(props.text).then(
        () => snackBar.showSnackBar({ message: 'Copied', color: 'success' }),
        () => snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
      )
    }

    return { handleCopy }
  }
})
</script>
<style scoped>
.ask-anna-copy-text code {
  color: white;
}
</style>
