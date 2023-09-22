<template>
  <VMenu
    v-model="menu"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props }">
      <div
        v-bind="props"
        class="cursor-pointer"
      >
        <div
          v-bind="props"
          class="flex"
          v-if="!$vuetify.display.xs"
        >
          <div v-if="isShowName">{{ metricRow.name }}:&nbsp;</div>
          <textarea
            readonly
            :cols="cols"
            :rows="calcRows"
            v-model="previewJson"
            class="noselect cursor-pointer"
            :style="{ resize: 'none' }"
          />
          <AskAnnaTooltip>
            <span>Click to see the value</span>
          </AskAnnaTooltip>
        </div>
        <textarea
          v-else
          readonly
          cols="80"
          :rows="calcRows"
          v-model="previewJson"
          class="noselect cursor-pointer"
          :style="{ resize: 'none' }"
        />
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
        :value="jsonString"
        languageName="json"
      />
    </AskAnnaCard>
  </VMenu>
</template>
<script setup lang="ts">
const props = defineProps({
  isShowName: {
    type: Boolean,
    default: () => false
  },
  maxStringLength: {
    type: Number,
    default: () => 20
  },
  labelsCount: {
    type: Number,
    default: () => 1
  },
  preview: {
    type: Boolean,
    default: () => true
  },
  fullText: {
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
const BREAK_LINE_REGEXP = /\r\n|\r|\n/g

const getLines = text => {
  if (text?.length === 0) return []
  return text?.split(BREAK_LINE_REGEXP)
}

const cols = computed(() => (props.preview && props.labelsCount === 1 ? 80 : 0))

const jsonString = computed(() => {
  let result = ''

  try {
    result = JSON.stringify(props.metricRow.value, null, 2)
  } catch (e) {
    return result
  }

  return result
})

const calcRows = computed(() => {
  if (!props.preview) return 1

  let preview = getLines(jsonString.value)

  return preview?.length > 6 ? 6 : preview?.length
})

const previewJson = computed(() => {
  if (!props.preview) return '...*'

  let preview = getLines(jsonString.value)
  if (preview?.length > 6) {
    preview = preview?.slice(0, 5)
    preview.push('...')
  }

  return preview?.join('\n')
})

const handleClose = () => (menu.value = false)

const handleCopy = () => copy.handleCopyText(jsonString.value)
</script>
<style>
.dictionary-type {
  opacity: 1 !important;
}

.noselect {
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
}

.noselect:focus {
  outline: none;
}
</style>
