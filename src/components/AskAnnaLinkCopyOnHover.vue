<template>
  <RouterLink
    class="no-underline group flex items-center "
    :to="routeLinkParams()"
    @click="handleOnClick"
  >
    <template v-if="!$vuetify.display.xs">
      {{ value }}
      <div>
        <AskAnnaCopyText
          icon
          :text="value"
          :showText="false"
          :iconColor="'secondary'"
          :buttonType="{ text: true }"
          :class="'invisible group-hover:visible'"
        />
      </div>
    </template>
    <template v-else>#{{ value }}</template>
  </RouterLink>
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
