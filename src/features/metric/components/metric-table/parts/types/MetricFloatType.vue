<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y top>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="list__item-content cursor--pointer">
        <div ref="divRef" class="list__item-value d-flex" :style="divStyles">
          <div v-if="isShowName">{{ metricRow.name }}:&nbsp;</div>
          {{ slicedNumber }}
        </div>
      </div>
    </template>
    <v-card>
      <v-app-bar dense height="40" flat>
        Name: {{ metricRow.name }}
        <v-spacer />
        <v-btn small outlined color="secondary" @click="handleCopy" class="mx-2 btn--hover">
          <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy
        </v-btn>
        <v-btn small icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <TheHighlight :value="slicedNumber" languageName="text" />
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import useCopy from '@/core/composition/useCopy'
import useNumeral from '@/core/composition/useNumeral'
import { ref, watch, computed } from '@vue/composition-api'
import TheHighlight from '@/core/components/highlight/TheHighlight.vue'

const props = defineProps({
  isShowName: {
    type: Boolean,
    default: () => false
  },
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

const copy = useCopy()
const numeral = useNumeral()

const menu = ref(false)
const divRef = ref(null)
const nudgeLeft = ref(0)
const divStyles = ref({})

const slicedNumber = computed(() => numeral.numberFormated(props.metricRow.value))

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
const handleCopy = () => copy.handleCopyText(slicedNumber.value)
</script>
