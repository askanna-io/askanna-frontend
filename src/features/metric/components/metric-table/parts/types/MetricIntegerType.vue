<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y top>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="list__item-content cursor--pointer">
        <div ref="divRef" class="list__item-value d-flex" :style="divStyles">
          <div v-if="isShowName">{{ metricRow.name }}:&nbsp;</div>
          {{ numeral.numberFormated(metricRow.value) }}
        </div>
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
      <TheHighlight :value="metricRow.value.toString()" languageName="text" />
    </AskAnnaCard>
  </v-menu>
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
