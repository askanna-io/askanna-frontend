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
            :style="divStyles"
            class="list__item-value flex"
          >
            <div v-if="isShowName">{{ metricRow.name }}:&nbsp;</div>
            {{ numeral.numberFormated(metricRow.value) }}
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
          :value="metricRow.value.toString()"
        />
      </AskAnnaCard>
    </VMenu>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
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
const numeral = useNumeral()

const menu = ref(false)
const divRef = ref(null)
const divStyles = ref({})
const nudgeLeft = ref(0)

const calcStyles = () => {
  if (!divRef.value) return

  let width =
    divRef.value.clientWidth ||
    divRef.value.scrollWidth ||
    divRef.value.parentElement.clientWidth ||
    divRef.value.parentElement.parentElement.clientWidth

  if (props.metricRow.value.length > 60) {
    nudgeLeft.value = width / 2 - 80
  } else {
    nudgeLeft.value = 100
  }

  if (!props.isLabels) {
    nudgeLeft.value = 400
  }
  if (width > 1000) {
    width = 600
  }

  divStyles.value = { maxWidth: `${width}px`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
}

watch(divRef, divRef => {
  if (!divRef) return

  setTimeout(() => calcStyles(), 3000)
})

const handleClose = () => (menu.value = false)
const handleCopy = () => copy.handleCopyText(props.metricRow.value)
</script>
