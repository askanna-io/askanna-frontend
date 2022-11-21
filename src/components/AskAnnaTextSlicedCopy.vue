<template>
  <div>
    <AskAnnaTooltip v-if="isSliced" top content-class="opacity-1">
      <template v-slot:activator="{ on, value: show }">
        <div v-on="on">
          <span>{{ valueSliced }}</span>

          <AskAnnaTooltip right content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaCopyText
                v-on="on"
                v-show="show"
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
      </template>
      <div>{{ value }}</div>
    </AskAnnaTooltip>

    <div v-else>
      <VHover v-slot="{ hover }" open-delay="200">
        <div>
          {{ valueSliced }}
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
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  value: {
    type: String,
    default: () => ''
  },
  maxLength: {
    type: Number,
    default: () => 23
  },
  maxLengthStart: {
    type: Number,
    default: () => 35
  },
  params: {
    type: Object,
    default: () => ({
      fullValue: false,
      slicedFromStart: false
    })
  }
})

const slicedText = useSlicedText()
const slicedStartText = useStartSlicedText()

const valueSliced = computed(() =>
  props.params.slicedFromStart
    ? slicedStartText(props.value, props.maxLengthStart)
    : slicedText(props.value, props.maxLength)
)

const isSliced = computed(
  () => props.value.length > (props.params.slicedFromStart ? props.maxLengthStart : props.maxLength)
)
</script>
