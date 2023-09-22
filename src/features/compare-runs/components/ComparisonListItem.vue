<template>
  <li
    class="list__item"
    :class="cssClasses"
    :style="listItemStyles"
  >
    <Component
      v-bind="props"
      :is="componentName"
    />
  </li>
</template>
<script setup lang="ts">
import ComparisonListItemEnv from './ComparisonListItemEnv.vue'
import ComparisonListItemText from './ComparisonListItemText.vue'
import ComparisonListItemDate from './ComparisonListItemDate.vue'
import ComparisonListItemLabel from './ComparisonListItemLabel.vue'
import ComparisonListItemEmpty from './ComparisonListItemEmpty.vue'
import ComparisonListItemMetric from './ComparisonListItemMetric.vue'
import ComparisonListItemTrigger from './ComparisonListItemTrigger.vue'
import ComparisonListItemTextSize from './ComparisonListItemTextSize.vue'
import ComparisonListItemDuration from './ComparisonListItemDuration.vue'
import AskAnnaChipStatus from '@/components/AskAnnaChipStatus.vue'
import AskAnnaTextSlicedCopy from '@/components/AskAnnaTextSlicedCopy.vue'
import AskAnnaLinkCopyOnHover from '@/components/AskAnnaLinkCopyOnHover.vue'
import RunInfoAvatar from '@/features/run/components/parts/RunInfoAvatar.vue'

const props = defineProps({
  value: {
    type: [String, Number, Object],
    default: () => ''
  },
  type: {
    type: String,
    default: () => 'text'
  },
  to: {
    type: String,
    default: () => ''
  },
  params: {
    type: Object,
    default: () => { }
  },
  routeParams: {
    type: Object,
    default: () => { }
  },
  dashed: {
    type: Boolean,
    default: () => false
  },
  bold: {
    type: Boolean,
    default: () => false
  },
  fullWidth: {
    type: Boolean,
    default: () => false
  },
  sticky: {
    type: Boolean,
    default: () => false
  },
  fullScreen: {
    type: Boolean,
    default: () => false
  }
})

const components = [
  {
    type: ['text'],
    component: ComparisonListItemText
  },
  {
    type: ['text-size'],
    component: ComparisonListItemTextSize
  },
  {
    type: ['status'],
    component: AskAnnaChipStatus
  },
  {
    type: ['date'],
    component: ComparisonListItemDate
  },
  {
    type: ['duration'],
    component: ComparisonListItemDuration
  },
  {
    type: ['code', 'run-suuid'],
    component: AskAnnaLinkCopyOnHover
  },
  {
    type: ['by'],
    component: RunInfoAvatar
  },
  {
    type: ['trigger'],
    component: ComparisonListItemTrigger
  },
  {
    type: ['environment'],
    component: ComparisonListItemEnv
  },
  {
    type: 'label',
    component: ComparisonListItemLabel
  },
  {
    type: 'metric',
    component: ComparisonListItemMetric
  },
  {
    type: 'empty',
    component: ComparisonListItemEmpty
  },
  {
    type: 'text-sliced',
    component: AskAnnaTextSlicedCopy
  }
]

const { width } = useAskAnnaWindowSize()

const cssClasses = computed(() => ({
  'font-bold': props.bold,
  'list__item--sticky': props.sticky,
  'list__item--width-full': props.fullWidth,
  'list__item--border-dashed': props.dashed
}))

const componentName = computed(() => {
  const type = components.find(item => item.type.includes(props.type))
  return type?.component || ComparisonListItemText
})

const listItemStyles = computed(() => {
  if (!props.sticky) return

  const itemWidth = props.fullScreen ? width.value : width.value > 1248 ? 1200 : width.value

  return { width: `${itemWidth - 175}px `, 'max-width': `${itemWidth - 175}px` }
})
</script>
<style scoped lang="scss">
.list {
  &__item {
    width: 243px;
    overflow: hidden;
    min-width: 243px;
    max-width: 243px;
  }

  &__item--position-left {
    margin-left: -3px;
  }

  &__item--border-dashed {
    border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
  }

  &__item--width-full {
    margin-right: 10px;
    width: 100%;
    max-width: 100%;
  }

  &__item--sticky {
    left: 60px;
    position: sticky;
  }
}
</style>
