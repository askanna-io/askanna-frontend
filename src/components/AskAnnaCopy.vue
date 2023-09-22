<template>
  <div>
    <div v-if="!masked">
      <span class="text-no-wrap">{{ prefix }} {{ sliceText }}</span>
      <AskAnnaButtonIcon
        v-if="(expanded && isSliced) || (expanded && isSliced && !masked)"
        class="px-0"
        variant="text"
        size="small"
        @click="expand = !expand"
      >
        <AskAnnaIcon :icon="expand ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
      </AskAnnaButtonIcon>
      <AskAnnaButtonIcon
        v-if="text"
        variant="text"
        size="x-small"
        class="invisible group-hover:visible group-focus:visible z-50"
        @click.prevent="handleCopyText(text)"
      >
        <AskAnnaIcon icon="mdi-content-copy" />
        <AskAnnaTooltip location="end">
          {{ copyTitle }}
        </AskAnnaTooltip>
      </AskAnnaButtonIcon>
      <AskAnnaTooltip
        top
        left
        v-if="!masked && isSliced"
        content-class="AskAnna-copy-tooltip opacity-1"
      >
        <span
          class="hover-content"
          v-html="text"
        />
      </AskAnnaTooltip>
    </div>
    <VExpandTransition>
      <div v-show="expand">
        <div
          class="expanded"
          v-html="restOftext"
        />
      </div>
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
  copyTitle: {
    type: String,
    default: 'Copy'
  }
})

const display = useDisplay()
const slicedText = useSlicedText()
const { handleCopyText } = useCopy()
const { width } = useAskAnnaWindowSize()

const expand = ref(false)

const delta = computed(() => {
  const [parentContainer] = document.getElementsByClassName('variables-table')
  const containerWidth = (parentContainer && parentContainer.offsetWidth) || 1000

  switch (toValue(display.name)) {
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
