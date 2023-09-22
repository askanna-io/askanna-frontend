<template>
  <AskAnnaTextArea
    ref="textArea"
    outlined
    clearable
    :label="title"
    v-model="value"
    spellcheck="false"
    class="json-input"
    :autofocus="!$vuetify.display.xs"
    :color="jsonerror ? 'error' : 'primary'"
    @blur="handleOnBlur"
    @focus="handleOnFocus"
    @click:clear="handleClear"
  >
    <template v-slot:details>
      <div class="text-error text-left font-normal text-base pb-2">{{ sanitise(jsonerror) }}</div>
    </template>
  </AskAnnaTextArea>
</template>

<script ref setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: () => ''
  },
  code: {
    type: String,
    default: ''
  },
  titleWidth: {
    type: String,
    default: '40px'
  }
})

const emit = defineEmits(['onInput', 'validete'])

const jsonerror = ref('')
const textArea = ref(null)
const isFocused = ref(false)
const isJsonValid = ref(true)

const value = computed({
  get: () => props.code,
  set: val => emit('onInput', val)
})

const validateJson = (val: string) => {
  if (!val) {
    isJsonValid.value = true
    jsonerror.value = ''

    emit('validete', isJsonValid.value)

    return
  }

  let jsonValue = null

  try {
    jsonValue = JSON.parse(val)
    jsonerror.value = ''
    isJsonValid.value = true
  } catch (e) {
    isJsonValid.value = false
    jsonerror.value = JSON.stringify(e.message)
    if (jsonerror.value.indexOf('position') > -1) {
      // highlight error position
      const textarea = textArea.value
      textarea?.focus()
      const positionStr = jsonerror.value.lastIndexOf('position') + 8
      const posi = parseInt(jsonerror.value.substr(positionStr, jsonerror.value.lastIndexOf('"')))
      if (posi >= 0) {
        textarea?.setSelectionRange(posi, posi + 1)
      }
    }
  }

  emit('validete', isJsonValid.value)
}

const handleOnBlur = () => {
  isFocused.value = false
  validateJson(value.value)
}

const handleOnFocus = () => (isFocused.value = true)

const handleClear = () => {
  jsonerror.value = ''
  isJsonValid.value = true

  emit('onInput', '')
  emit('validete', isJsonValid.value)
}

const sanitise = (text: string) => text.slice(1, -1)
</script>
<style lang="scss">
.json-input .v-messages {
  display: none;
}

.json-input .v-input__details {
  padding: 0 0 0 16px !important
}
</style>