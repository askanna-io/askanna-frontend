<template>
  <div class="group">
    {{ envNameSliced }}
    <AskAnnaTooltip v-if="isSliced">
      <div>Image name: {{ imageComputed.name }}</div>
    </AskAnnaTooltip>
    <AskAnnaCopyText
      icon
      :text="envNameComputed"
      :showText="false"
      :buttonType="{ text: true }"
      :class="'invisible group-hover:visible px-0 '"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
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

const slicedStartText = useStartSlicedText()

const imageComputed = computed(() => ({
  name: props.value?.name || '',
  tag: props.value?.tag || '',
  digest: props.value?.digest || ''
}))

const envNameComputed = computed(() => props.value?.name)
const envNameSliced = computed(() => slicedStartText(props.value?.name, 23))

const isSliced = computed(() => envNameComputed.value?.length > 24)
</script>
