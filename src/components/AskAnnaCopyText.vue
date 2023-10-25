<template>
  <span class="askanna-copy-text not-prose">
    <span
      v-if="showText"
      :class="styleClasses"
    >{{ text }}</span>

    <AskAnnaButtonIconSquare
      v-show="show"
      iconSize="x-small"
      :iconColor="iconColor"
      icon="mdi-content-copy"
      class="invisible group-hover:visible group-focus:visible z-50"
      @click.prevent="handleCopy"
    >
      <AskAnnaTooltip
        v-if="showTooltip"
        :location="tooltipLocation"
      >
        <span>{{ copyTitle }}</span>
      </AskAnnaTooltip>
    </AskAnnaButtonIconSquare>
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: {
    type: Boolean,
    default: () => false
  },
  show: {
    type: Boolean,
    default: () => true
  },
  tooltipLocation: {
    type: String,
    default: () => 'top'
  },
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
      variant: "outlined"
    })
  },
  styleClasses: {
    type: String,
    default: () => 'px-2 py-0 bg-primary text-white rounded font-semibold'
  },
  showText: {
    type: Boolean,
    default: () => true
  },
  showTooltip: {
    type: Boolean,
    default: () => true
  },
  iconColor: {
    type: String,
    default: () => 'secondary'
  },
  copyTitle: {
    type: String,
    default: 'Copy'
  }
})

const copy = useCopy()

const handleCopy = () => copy.handleCopyText(props.text)
</script>
<style scoped>
.askanna-copy-text code {
  color: white;
}
</style>
