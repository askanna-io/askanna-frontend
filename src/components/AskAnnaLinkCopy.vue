<template>
  <div class="code-wrapper as">
    <span v-if="text" class="font-weight-bold mr-1">{{ text }}</span>
    <RouterLink class="ask-anna-link" @click.native="handleOnClick" :to="routeLinkParams()">
      {{ value }}
    </RouterLink>
    <AskAnnaCopyText
      :text="value"
      :showText="false"
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
    default: () => {}
  },
  to: {
    type: String,
    default: () => ''
  },
  onClick: {
    type: Function,
    default: null
  }
})

const { route } = useRouterAskAnna()

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
<style scoped>
.code-wrapper {
  display: flex;
  align-items: baseline;
}
</style>
