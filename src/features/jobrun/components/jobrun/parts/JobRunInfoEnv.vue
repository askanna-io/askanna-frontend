<template>
  <v-tooltip top :nudge-left="nudgeLeft" content-class="opacity-1">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <span>{{ text }}: {{ fullValue ? value.name : envNameSliced }}</span>
      </div>
    </template>
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
  </v-tooltip>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
import useStartSlicedText from '@/core/composition/useStartSlicedText'

export default defineComponent({
  name: 'JobRunInfoEnv',

  props: {
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
  },

  setup({ value }) {
    const slicedStartText = useStartSlicedText()

    const envName = computed(() =>
      value.image?.tag && value.image?.name ? `${value.image?.name}:${value.image?.tag}` : ''
    )

    const imageComputed = computed(() => ({
      name: value.image?.name || '',
      tag: value.image?.tag || '',
      digest: value.image?.digest || ''
    }))
    const envNameSliced = computed(() => slicedStartText(envName.value || value.name || value.image?.name, 35))

    return { envNameSliced, imageComputed }
  }
})
</script>
