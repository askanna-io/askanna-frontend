<template>
  <div>
    <VMenu
      v-model="menu"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <div
          v-bind="props"
          class="list__item-content cursor-pointer"
        >
          <div
            ref="divRef"
            class="list__item-value flex max-w-sm"
          >
            <div v-if="isShowName">{{ metricRow.name }}:&nbsp;</div>
            <p class="truncate text-ellipsis">{{ metricRow.value }}</p>
          </div>
        </div>
      </template>
      <AskAnnaCard class="w-full min-w-72">
        <AskAnnaToolbar>
          <div class="flex w-full items-center justify-between pl-4">
            Name: {{ metricRow.name }}
            <div class="flex gap-1 pr-2">
              <span class="flex">
                <AskAnnaIcon
                  size="small"
                  @click="handleCopy"
                  icon="mdi-content-copy"
                  class="pointer hover:text-primary"
                />
                <AskAnnaTooltip>
                  Copy value
                </AskAnnaTooltip>
              </span>
              <span class="flex mt-0.5">
                <AskAnnaIcon
                  size="small"
                  icon="mdi-close"
                  @click="handleClose"
                  class="pointer hover:text-primary"
                />
                <AskAnnaTooltip>
                  Close
                </AskAnnaTooltip>
              </span>
            </div>
          </div>
        </AskAnnaToolbar>
        <TheHighlight
          languageName="text"
          :value="metricRow.value"
        />
      </AskAnnaCard>
    </VMenu>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  isLabel: {
    type: Boolean,
    default: () => false
  },
  isLabels: {
    type: Boolean,
    default: () => false
  },
  isShowName: {
    type: Boolean,
    default: () => false
  },
  metricRow: {
    type: Object,
    default: function () {
      return {
        name: '',
        type: '',
        value: ''
      }
    }
  }
})
const copy = useCopy()

const menu = ref(false)
const divRef = ref(null)

const handleClose = () => (menu.value = false)
const handleCopy = () => copy.handleCopyText(props.metricRow.value)
</script>
<style lang="scss" scoped>
.AskAnna-string-type {
  white-space: break-spaces;
}

.list {
  &__item-content {
    display: flex;
    height: 100%;
    align-items: center;
  }

  &__item-value {
    width: 100%;
  }
}
</style>
