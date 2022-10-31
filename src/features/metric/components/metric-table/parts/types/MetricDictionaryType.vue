<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y top>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="cursor--pointer">
        <AskAnnaTooltip v-if="!$vuetify.breakpoint.xsOnly" top left :nudge-left="100" content-class="opacity-1">
          <template v-slot:activator="{ on }">
            <div v-on="on" class="d-flex">
              <div v-if="isShowName">{{ metricRow.name }}:&nbsp;</div>
              <textarea
                readonly
                :cols="cols"
                :rows="calcRows"
                v-model="previewJson"
                class="noselect cursor--pointer"
                :style="{ resize: 'none' }"
              />
            </div>
          </template>
          <span>Click to see the value</span>
        </AskAnnaTooltip>
        <textarea
          v-else
          readonly
          cols="80"
          :rows="calcRows"
          v-model="previewJson"
          class="noselect cursor--pointer"
          :style="{ resize: 'none' }"
        />
      </div>
    </template>
    <AskAnnaCard>
      <v-app-bar dense height="40" flat>
        Name: {{ metricRow.name }}
        <AskAnnaSpacer />
        <AskAnnaButton small outlined color="secondary" @click="handleCopy" class="mx-2 btn--hover">
          <AskAnnaIcon color="secondary" left>mdi-content-copy</AskAnnaIcon>Copy
        </AskAnnaButton>
        <AskAnnaButton small icon @click="handleClose">
          <AskAnnaIcon>mdi-close</AskAnnaIcon>
        </AskAnnaButton>
      </v-app-bar>
      <TheHighlight :value="jsonString" languageName="json" />
    </AskAnnaCard>
  </v-menu>
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
  if (text.length === 0) return []
  return text.split(BREAK_LINE_REGEXP)
}

const cols = computed(() => (props.preview ? 80 : 1))

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

  return preview.length > 6 ? 6 : preview.length
})

const previewJson = computed(() => {
  if (!props.preview) return '...*'

  let preview = getLines(jsonString.value)
  if (preview.length > 6) {
    preview = preview.slice(0, 5)
    preview.push('...')
  }

  return preview.join('\n')
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
