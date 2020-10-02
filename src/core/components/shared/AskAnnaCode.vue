<template>
  <div
    :class="{ 'v-input--is-focused primary--text': isFocused, 'error--text': jsonerror }"
    class="v-input--is-label-active v-input v-textarea v-textarea--no-resize v-input--is-dirty theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
  >
    <div class="v-input__control">
      <div class="v-input__slot">
        <fieldset aria-hidden="true">
          <legend style="width: 63px;"><span>&#8203;</span></legend>
        </fieldset>
        <div class="v-text-field__slot">
          <label
            for="input-174"
            :class="{ 'primary--text': isFocused, 'error--text': jsonerror }"
            class="v-label theme--light v-label--active"
            style="left: 0px; right: auto; position: absolute;"
            >{{ title }}</label
          >
          <textarea
            spellcheck="false"
            autofocus
            no-resize
            :label="title"
            v-model="value"
            @blur="handleOnBlur"
            @focus="handleOnFocus"
            rows="7"
            ref="textArea"
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

<script>
import TheHighlight from '@/core/components/highlight/TheHighlight'
import { ref, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaCode',

  props: {
    title: {
      type: String,
      default: () => ''
    },
    code: {
      type: String,
      default: ''
    }
  },
  components: {
    TheHighlight
  },

  setup(props, context) {
    const jsonerror = ref('')
    const textArea = ref(null)
    const isFocused = ref(false)
    const isJsonValid = ref(true)

    const value = computed({
      get: () => props.code,
      set: val => context.emit('onInput', val)
    })

    const validateJson = val => {
      if (!val) {
        isJsonValid.value = true
        jsonerror.value = ''
        context.emit('validete', jsonerror.value)

        return
      }
      let jsonValue = null

      try {
        jsonValue = JSON.parse(val)
        isJsonValid.value = true
        jsonerror.value = ''
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
      context.emit('validete', jsonerror.value)
    }

    const handleOnBlur = () => {
      isFocused.value = false
      validateJson(value.value)
    }

    const handleOnFocus = () => (isFocused.value = true)

    const handleClear = () => {
      jsonerror.value = ''
      isJsonValid.value = true
      context.emit('onInput', '')
      context.emit('validete', jsonerror.value)
    }

    const sanitise = text => text.slice(1, -1)

    return {
      value,
      sanitise,
      jsonerror,
      textArea,
      isFocused,
      isJsonValid,
      handleClear,
      handleOnBlur,
      handleOnFocus
    }
  }
})
</script>
<style scoped>
textarea {
  resize: none;
  background-color: transparent;
  border-style: none;
  border-top-style: none;
}
</style>
