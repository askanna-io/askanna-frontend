<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, value }">
      <div v-on="on">
        <v-btn class="px-0 ask-anna-copy" ref="btn" text small>{{ prefix }} {{ sliceText }}</v-btn>
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
import { ref, watch, computed, defineComponent } from '@vue/composition-api'
import useSlicedText from '@/core/composition/useSlicedText'
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
    },
    smartSlice: {
      type: Boolean,
      default: false
    }
  },

  setup(props, context) {
    const copy = useCopy(context)
    const snackBar = useSnackBar()
    const slicedText = useSlicedText()

    const btn = ref(null)
    const btnWidtn = ref(100)

    const sliceText = computed(() => {
      return props.smartSlice ? slicedText(props.text, props.show) : props.text.slice(0, props.show)
    })

    watch(btn, async btn => {
      if (!btn) return
      btnWidtn.value = btn.$el.offsetWidth
    })

    return { btn, sliceText, handleCopy: copy.handleCopyText }
  }
})
</script>
<style>
.ask-anna-copy .v-btn__content {
  text-transform: initial;
}
</style>
