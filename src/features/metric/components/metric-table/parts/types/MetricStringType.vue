<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y top>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="list__item-content cursor--pointer">
        <div ref="divRef" class="list__item-value d-flex" :style="divStyles">
          <div v-if="isShowName">{{ metricRow.name }}:&nbsp;</div>
          {{ metricRow.value }}
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
      <TheHighlight :value="metricRow.value" languageName="text" />
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import useCopy from '@/core/composition/useCopy'
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
