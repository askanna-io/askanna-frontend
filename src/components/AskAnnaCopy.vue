<template>
  <div>
    <AskAnnaTooltip top left v-if="!masked" content-class="AskAnna-copy-tooltip opacity-1">
      <template v-slot:activator="{ on, value }">
        <div v-on="on">
          <span class="text-no-wrap">{{ prefix }} {{ sliceText }}</span>
          <AskAnnaButton
            v-if="(expanded && isSliced) || (expanded && isSliced && !masked)"
            text
            icon
            class="px-0 ask-anna-copy"
            @click="expand = !expand"
          >
            <AskAnnaIcon>mdi-chevron-{{ expand ? 'up' : 'down' }}</AskAnnaIcon>
          </AskAnnaButton>
          <AskAnnaTooltip v-if="showCopyButton" right content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaButton icon text x-small v-on="on" v-show="value" @click.stop="handleCopyText(text)"
                ><AskAnnaIcon>mdi-content-copy</AskAnnaIcon></AskAnnaButton
              >
            </template>
            <span>Copy</span>
          </AskAnnaTooltip>
        </div>
      </template>

      <span class="hover-content" v-html="text" />
    </AskAnnaTooltip>
    <VExpandTransition>
      <AskAnnaCard flat v-show="expand" class="transparent"><div class="expanded" v-html="restOftext" /> </AskAnnaCard>
    </VExpandTransition>
    <span v-if="masked">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
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
})

const { width } = useWindowSize()
const slicedText = useSlicedText()
const { handleCopyText } = useCopy()
const context = getCurrentInstance()

const expand = ref(false)

const delta = computed(() => {
  const [parentContainer] = document.getElementsByClassName('variables-table')
  const containerWidth = (parentContainer && parentContainer.offsetWidth) || 1000

  switch (context?.proxy.$root.$vuetify.breakpoint.name) {
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
</script>
<style>
.AskAnna-copy-tooltip .hover-content {
  white-space: break-spaces;
}
.expanded {
  white-space: break-spaces;
}
</style>
