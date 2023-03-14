<template>
  <span class="ask-anna-copy-text">
    <code
      v-if="showText"
      :class="styleClasses"
    >{{ text }}</code>
    <AskAnnaTooltip
      v-if="showTooltip"
      top
      content-class="opacity-1"
    >
      <template v-slot:activator="{ on }">
        <AskAnnaButton
          v-on="on"
          v-show="show"
          :icon="icon"
          x-small
          color="secondary"
          :class="buttonClasses"
          :text="buttonType.text"
          @click.prevent="handleCopy"
          :outlined="buttonType.outlined"
        >
          <AskAnnaIcon
            small
            :color="iconColor"
          >mdi-content-copy</AskAnnaIcon>
        </AskAnnaButton>
      </template>
      <span>Copy</span>
    </AskAnnaTooltip>
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
    default: () => 'px-2 mr-2 py-0 primary text--white'
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
  }
})

const copy = useCopy()

const handleCopy = () => copy.handleCopyText(props.text)
</script>
<style scoped>.ask-anna-copy-text code {
  color: white;
}

.primary--black {
  color: #000000de !important;
}</style>
