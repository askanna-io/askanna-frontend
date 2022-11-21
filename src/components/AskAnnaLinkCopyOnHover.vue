<template>
  <RouterLink class="ask-anna-link" :to="routeLinkParams()" @click="handleOnClick">
    <template v-if="!$vuetify.breakpoint.xsOnly">
      <VHover v-slot="{ hover }" open-delay="200">
        <div>
          {{ value }}
          <AskAnnaTooltip right content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaCopyText
                v-on="on"
                v-show="hover"
                icon
                :text="value"
                :showText="false"
                :iconColor="'grey lighten-2'"
                :buttonType="{ text: true }"
                :styleClasses="'px-0 white font-weight-regular text--regular body-1'"
              />
            </template>
            <span>Copy</span>
          </AskAnnaTooltip>
        </div>
      </VHover>
    </template>

    <template v-else> #{{ value }} </template>
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
