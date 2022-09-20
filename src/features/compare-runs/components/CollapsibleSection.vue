<template>
  <details class="collapsible-section" :open="isOpen" @toggle="handleToggle">
    <summary class="collapsible-section__summary px-0" :class="{ 'cursor--pointer': !disabled }">
      <div class="collapsible-section__title">
        <h4 :class="{ 'primary--text': isOpen, 'secondary--text': disabled || !isOpen, 'ml-10': disabled }">
          {{ title }}{{ disabled ? ': ' : '' }}
        </h4>

        <v-btn
          v-if="!readonly && !disabled"
          class="collapsible-section__icon mr-1"
          text
          icon
          :color="isOpen ? 'primary' : 'secondary'"
          @click="handleIconClick"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
        <div v-if="disabled" class="ml-1 collapsible-section__no-data">
          <h4 class="secondary--text">{{ noDataText }}</h4>
        </div>
      </div>
    </summary>
    <v-expand-transition>
      <div v-if="isOpen && !disabled"><slot /></div
    ></v-expand-transition>
  </details>
</template>

<script setup lang="ts">
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  noDataText: {
    type: String,
    default: ''
  }
})

const isOpen = ref(props.open)

const icon = computed(() => (isOpen.value ? 'mdi-chevron-up' : 'mdi-chevron-down'))

const handleToggle = e => (isOpen.value = e.target.open)

const handleIconClick = () => (isOpen.value = !isOpen.value)
</script>

<style lang="scss">
.collapsible-section {
  width: 10000px;
  &__summary {
    display: flex;
    list-style: none;
    outline: none;
    color: --main-color;
    align-items: center;
    position: sticky;
    left: 5px;
    z-index: 1;
    width: fit-content;
    margin-bottom: 15px;
  }

  &__icon {
    order: -1;
    color: blue;
    height: 1.95rem;
  }

  &__title {
    display: flex;
    flex-basis: 100px;
    flex-shrink: 0;
    left: 0px;
    min-width: 385px;
    z-index: 1;
    align-items: center;
  }

  &__no-data {
    display: flex;
  }
}
</style>
