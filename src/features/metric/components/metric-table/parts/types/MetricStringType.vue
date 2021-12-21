<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y top>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="cursor--pointer">
        <v-tooltip v-if="!$vuetify.breakpoint.xsOnly" top :nudge-left="nudgeLeft" content-class="opacity-1">
          <template v-slot:activator="{ on }">
            <div v-on="on" ref="divRef" :style="divStyles">
              {{ metricRow.value }}
            </div>
          </template>
          <span class="AskAnna-string-type" v-html="metricRow.value" />
        </v-tooltip>
        <div v-else v-on="on" ref="divRef" :style="divStyles">
          {{ metricRow.value }}
        </div>
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
      <the-highlight :value="metricRow.value" languageName="text" />
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import { ref, watch } from '@vue/composition-api'
import TheHighlight from '@/core/components/highlight/TheHighlight.vue'

const props = defineProps({
  isLabel: {
    type: Boolean,
    default: () => false
  },
  isLabels: {
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

const menu = ref(false)
const divRef = ref(null)
const divStyles = ref({})

const nudgeLeft = ref(0)

watch(divRef, async divRef => {
  if (!divRef) return

  let width = divRef.clientWidth || divRef.scrollWidth
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
})
const handleClose = () => (menu.value = false)
const handleCopy = () => copy.handleCopyText(props.metricRow.value)
</script>
<style scoped>
.AskAnna-string-type {
  white-space: break-spaces;
}
</style>
