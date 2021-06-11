<template>
  <div>
    <v-tooltip top left v-if="!masked" content-class="AskAnna-copy-tooltip">
      <template v-slot:activator="{ on, value }">
        <div v-on="on">
          {{ prefix }} {{ sliceText }}
          <v-btn
            v-if="(expanded && isSliced) || (expanded && isSliced && !masked)"
            text
            icon
            class="px-0 ask-anna-copy"
            @click="expand = !expand"
          >
            <v-icon>mdi-chevron-{{ expand ? 'up' : 'down' }}</v-icon>
          </v-btn>
          <v-tooltip v-if="showCopyButton" right>
            <template v-slot:activator="{ on }">
              <v-btn icon text x-small v-on="on" v-show="value" @click.stop="handleCopy(text)"
                ><v-icon>mdi-content-copy</v-icon></v-btn
              >
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </template>

      <span class="hover-content" v-html="text" />
    </v-tooltip>
    <v-expand-transition>
      <v-card flat v-show="expand" class="transparent"><div class="expanded" v-html="restOftext" /> </v-card>
    </v-expand-transition>
    <span v-if="masked">
      {{ text }}
    </span>
  </div>
</template>

<script>
import { useWindowSize } from '@u3u/vue-hooks'
import useCopy from '@/core/composition/useCopy'
import useSlicedText from '@/core/composition/useSlicedText'
import { ref, computed, defineComponent } from '@vue/composition-api'

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
    },
    width: {
      type: Number,
      default: () => 100
    },
    masked: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    },
    showCopyButton: {
      type: Boolean,
      default: true
    }
  },

  setup(props, context) {
    const copy = useCopy(context)
    const { width } = useWindowSize()
    const slicedText = useSlicedText()

    const expand = ref(false)

    const delta = computed(() => {
      const [parentContainer] = document.getElementsByClassName('variables-table')
      const containerWidth = (parentContainer && parentContainer.offsetWidth) || 1000

      switch (context.root.$vuetify.breakpoint.name) {
        case 'xs':
          return containerWidth + width.value - width.value + (props.expanded ? 500 : 500)

        case 'sm':
          return containerWidth + width.value - width.value + (props.expanded ? 150 : -40)

        case 'md':
          return containerWidth + width.value - width.value + (props.expanded ? 290 : 50)

        case 'lg':
          return containerWidth + width.value - width.value + (props.expanded ? 420 : 100)

        default:
          return containerWidth + width.value - width.value + (props.expanded ? 300 : 100)
      }
    })

    const rowWidth = computed(() => (delta.value * props.width) / 100 / 8)
    const isSliced = computed(() => props.text?.length > rowWidth.value)

    const sliceText = computed(() =>
      props.smartSlice ? slicedText(props.text, rowWidth.value) : props.text.slice(0, props.show)
    )
    const restOftext = computed(() => (isSliced.value ? props.text.slice(sliceText.value.length - 3) : props.text))

    return { expand, isSliced, sliceText, restOftext, handleCopy: copy.handleCopyText }
  }
})
</script>
<style>
.AskAnna-copy-tooltip .hover-content {
  white-space: break-spaces;
}
.expanded {
  white-space: break-spaces;
}
</style>
