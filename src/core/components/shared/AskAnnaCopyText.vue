<template>
  <span class="ask-anna-copy-text">
    <code v-if="showText" :class="styleClasses">{{ text }}</code>
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          class=""
          x-small
          color="secondary"
          :class="buttonClasses"
          :text="buttonType.text"
          @click.stop="handleCopy"
          :outlined="buttonType.outlined"
        >
          <v-icon small :color="iconColor">mdi-content-copy</v-icon>
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
    },
    buttonClasses: {
      type: String,
      default: () => 'btn--hover btn--without-text'
    },
    buttonType: {
      type: Object,
      default: () => ({
        text: false,
        outlined: true
      })
    },
    styleClasses: {
      type: String,
      default: () => 'px-2 mr-2 primary text--white'
    },
    showText: {
      type: Boolean,
      default: () => true
    },
    iconColor: {
      type: String,
      default: () => 'secondary'
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

.primary--black {
  color: #000000de !important;
}
</style>
