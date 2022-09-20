<template>
  <div
    :class="{ 'v-input--is-focused primary--text': isFocused, 'error--text': jsonerror }"
    class="v-input--is-label-active v-input v-textarea v-textarea--no-resize v-input--is-dirty theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
  >
    <div class="v-input__control">
      <div class="v-input__slot">
        <fieldset aria-hidden="true">
          <legend :style="{ width: titleWidth }"><span>&#8203;</span></legend>
        </fieldset>
        <div class="v-text-field__slot pt-2">
          <label
            for="input-174"
            class="v-label theme--light v-label--active"
            style="left: 0px; right: auto; position: absolute"
            :class="{ 'primary--text': isFocused, 'error--text': jsonerror }"
            >{{ title }}</label
          >
          <textarea
            rows="7"
            no-resize
            ref="textArea"
            :label="title"
            v-model="value"
            spellcheck="false"
            @blur="handleOnBlur"
            @focus="handleOnFocus"
            :autofocus="!$vuetify.breakpoint.xsOnly"
          />
        </div>
        <div class="v-input__append-inner">
          <div class="v-input__icon v-input__icon--clear">
            <button
              @click="handleClear"
              :class="{ 'error--text': jsonerror }"
              type="button"
              aria-label="clear icon"
              class="v-icon notranslate v-icon--link mdi mdi-close theme--light"
            />
          </div>
        </div>
      </div>
      <div class="v-text-field__details">
        <div class="v-messages theme--light error--text">
          <div class="v-messages__wrapper">{{ sanitise(jsonerror) }}</div>
        </div>
      </div>
    </div>
  </div>
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
      textarea.focus()
      const positionStr = jsonerror.value.lastIndexOf('position') + 8
      const posi = parseInt(jsonerror.value.substr(positionStr, jsonerror.value.lastIndexOf('"')))
      if (posi >= 0) {
        textarea.setSelectionRange(posi, posi + 1)
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
<style scoped>
textarea {
  width: 100%;
  resize: none;
  border-style: none;
  border-top-style: none;
  background-color: transparent;
}
</style>
