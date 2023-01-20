<template>
  <div>
    <VMenu v-model="menu" :close-on-content-click="false" offset-y top>
      <template v-slot:activator="{ on }">
        <div v-on="on" class="list__item-content cursor--pointer">
          <div ref="divRef" class="list__item-value d-flex" :style="divStyles">
            <div v-if="isShowName">{{ metricRow.name }}:&nbsp;</div>
            {{ numeral.numberFormated(metricRow.value) }}
          </div>
        </div>
      </template>
      <AskAnnaCard>
        <VAppBar dense height="40" flat>
          Name: {{ metricRow.name }}
          <AskAnnaSpacer />
          <AskAnnaButton small outlined color="secondary" @click="handleCopy" class="mx-2 btn--hover">
            <AskAnnaIcon color="secondary" left>mdi-content-copy</AskAnnaIcon>Copy
          </AskAnnaButton>
          <AskAnnaButton small icon @click="handleClose">
            <AskAnnaIcon>mdi-close</AskAnnaIcon>
          </AskAnnaButton>
        </VAppBar>
        <TheHighlight :value="metricRow.value.toString()" languageName="text" />
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
