<template>
  <v-tooltip top :nudge-left="nudgeLeft" content-class="opacity-1">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <span
          ><span v-if="text" class="font-weight-bold">{{ text }}: </span
          >{{ fullValue ? value.name : envNameSliced }}</span
        >
        <ask-anna-copy-text
          :showText="false"
          :text="envNameComputed"
          :iconColor="'grey lighten-2'"
          :buttonType="{ text: true }"
          :styleClasses="'px-0 white font-weight-regular text--regular body-1'"
        />
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
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import useStartSlicedText from '@/core/composition/useStartSlicedText'
import AskAnnaCopyText from '@/core/components/shared/AskAnnaCopyText.vue'

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

const envName = computed(() =>
  props.value.image?.tag && props.value.image?.name ? `${props.value.image?.name}:${props.value.image?.tag}` : ''
)

const imageComputed = computed(() => ({
  name: props.value.image?.name || '',
  tag: props.value.image?.tag || '',
  digest: props.value.image?.digest || ''
}))

const envNameSliced = computed(() => slicedStartText(envName.value || props.value.name || props.value.image?.name, 35))

const envNameComputed = computed(() => envName.value || props.value.name || props.value.image?.name)
</script>
