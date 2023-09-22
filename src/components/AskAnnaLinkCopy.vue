<template>
  <div class="group flex items-center">
    <span
      v-if="text"
      class="font-bold mr-1"
    >{{ text }}</span>
    <RouterLink
      :to="routeLinkParams()"
      class="no-underline whitespace-pre"
      @click.native="handleOnClick"
    >
      {{ slicedValue }}
    </RouterLink>
    <AskAnnaCopyText
      :text="value"
      :showText="false"
      :copyTitle="copyTitle"
      :iconColor="'grey lighten-2'"
      :buttonType="{ text: true }"
      :styleClasses="'px-0 white font-weight-regular text--regular body-1'"
    />
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['click'])

const props = defineProps({
  text: {
    type: String,
    default: () => ''
  },
  value: {
    type: String,
    default: () => ''
  },
  routeParams: {
    type: Object,
    default: () => { }
  },
  to: {
    type: String,
    default: () => ''
  },
  onClick: {
    type: Function,
    default: null
  },
  copyTitle: {
    type: String,
    default: 'Copy'
  }
})

const slicedText = useSlicedText()
const { route } = useRouterAskAnna()

const slicedValue = computed(() => slicedText(props.value, 100))
const handleOnClick = event => emits('click', event)

const routeLinkParams = () => {
  return {
    name: props.to,
    params: {
      ...route.params,
      ...props.routeParams
    }
  }
}
</script>
