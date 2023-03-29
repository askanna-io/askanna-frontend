<template>
  <div class="z-30">
    <AskAnnaTooltip
      v-if="!$vuetify.breakpoint.xsOnly"
      top
      content-class="opacity-1"
    >
      <template v-slot:activator="{ on, value: isHover }">
        <div
          v-on="on"
          :class="{ 'pr-5': !isHover }"
          class="d-flex align-center justify-start"
        >
          <AskAnnaButton
            plain
            min-width="10"
            class="px-0 text-none justify-start tracking-normal opacity-1 font-weight-regular"
          >{{ text }}</AskAnnaButton>
          <AskAnnaTooltip
            right
            content-class="opacity-1"
          >
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                icon
                text
                x-small
                v-on="on"
                v-show="isHover"
                @click.prevent="copy.handleCopyText(text)"
              >
                <AskAnnaIcon>mdi-content-copy</AskAnnaIcon>
              </AskAnnaButton>
            </template>
            <span>Copy job name</span>
          </AskAnnaTooltip>
        </div>
      </template>
      <div>Job SUUID: {{ value }}</div>
      <div>Job name: {{ text }}</div>
    </AskAnnaTooltip>
    <template v-else>{{ text }} </template>
  </div>
</template>

<script setup lang="ts">
const copy = useCopy()

defineProps({
  text: {
    type: String,
    default: ''
  },

  value: {
    type: String,
    default: () => ''
  }
})
</script>