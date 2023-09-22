<template>
  <div class="w-full group flex items-center whitespace-pre">
    <span
      v-if="text"
      class="font-bold"
    >{{ text }}:&nbsp;</span>{{ envNameSliced }}
    <AskAnnaCopyText
      :showText="false"
      tooltipLocation="end"
      :copyTitle="copyTitle"
      :text="envNameComputed"
      :iconColor="'grey lighten-2'"
      :buttonType="{ text: true }"
    />
    <AskAnnaTooltip>
      <template v-if="fullMode">
        <div>Image name: {{ imageComputed.name }}</div>
        <div>Image tag: {{ imageComputed.tag || 'not provided' }}</div>
        <div>Image digest: {{ imageComputed.digest }}</div>
        <div>Time zone: {{ value.timezone }}</div>
      </template>
      <template v-else>
        <div>Image name: {{ value.name }}</div>
        <div>Time zone: {{ value.timezone }}</div>
      </template>
    </AskAnnaTooltip>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  fullMode: {
    type: Boolean,
    default: true
  },
  fullValue: {
    type: Boolean,
    default: false
  },
  nudgeLeft: {
    type: Number,
    default: () => 0
  },
  isJobSection: {
    type: Boolean,
    default: false
  },
  copyTitle: {
    type: String,
    default: 'Copy'
  },
  value: {
    type: Object,
    default: () => ({
      name: '',
      label: '',
      timezone: '',
      description: '',
      image: { name: '', tag: '', digest: '' }
    })
  }
})

const display = useDisplay()
const { width } = useWindowSize()
const slicedStartText = useStartSlicedText()

const envName = computed(() =>
  props.value.image?.tag && props.value.image?.name ? `${props.value.image?.name}:${props.value.image?.tag}` : ''
)

const imageComputed = computed(() => ({
  name: props.value.image?.name || '',
  tag: props.value.image?.tag || '',
  digest: props.value.image?.digest || ''
}))

const widthCalc = computed(() => ({
  job: {
    xs: (width.value - 170) / 7.5,
    sm: width.value / 20,
    md: width.value / 20,
    lg: width.value / 20,
    default: width.value / 10

  },
  run: {
    xs: (width.value - 170) / 7.5,
    sm: width.value / 27,
    md: (width.value - 170) / 38.5,
    lg: width.value / 50,
    default: width.value / 40
  }
}))

const maxLength = computed(() => {
  const widthValues = props.isJobSection ? widthCalc.value.job : widthCalc.value.run
  const displayName = toValue(display.name)

  return widthValues[displayName] || widthValues.default

})
const envNameSliced = computed(() => {
  return slicedStartText(envName.value || props.value.name || props.value.image?.name, maxLength.value)
})

const envNameComputed = computed(() => envName.value || props.value.name || props.value.image?.name)
</script>
