<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y top>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="cursor--pointer">
        <v-tooltip v-if="!$vuetify.breakpoint.xsOnly" top left :nudge-left="100" content-class="opacity-1">
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <textarea
                readonly
                cols="80"
                :rows="calcRows"
                v-model="previewJson"
                class="noselect cursor--pointer"
                :style="{ resize: 'none' }"
              />
            </div>
          </template>
          <span>Click to see the value</span>
        </v-tooltip>
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
    <v-card>
      <v-app-bar dense height="40" flat>
        Name: {{ metricRow.name }}
        <v-spacer />
        <v-btn small outlined color="secondary" @click="handleCopy" class="mr-1 btn--hover">
          <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy
        </v-btn>
        <v-btn small icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <TheHighlight :value="jsonString" languageName="json" />
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import useCopy from '@/core/composition/useCopy'
import { ref, computed } from '@vue/composition-api'
import TheHighlight from '@/core/components/highlight/TheHighlight.vue'

const props = defineProps({
  maxStringLength: {
    type: Number,
    default: () => 20
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
  let preview = getLines(jsonString.value)

  return preview.length > 6 ? 6 : preview.length
})

const previewJson = computed(() => {
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
