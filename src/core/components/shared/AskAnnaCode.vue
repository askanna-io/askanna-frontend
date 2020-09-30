<template>
  <v-textarea
    :error-messages="jsonerror"
    clearable
    no-resize
    ref="textArea"
    rows="7"
    outlined
    name="input-7-4"
    :label="title"
    v-model="value"
    @blur="handleOnBlur"
  />
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
    const handleUpdateValue = value => context.emit('onChangeCode', value)

    const value = computed({
      get: () => props.code,
      set: val => context.emit('onInput', val)
    })

    const validateJson = val => {
      let jsonValue = null

      try {
        jsonValue = JSON.parse(val)
        isJsonValid.value = true
        jsonerror.value = ''
      } catch (e) {
        isJsonValid.value = false
        jsonerror.value = JSON.stringify(e.message)
      }
      console.log('emit')
      context.emit('validete', jsonerror.value)
    }

    const handleOnBlur = () => {
      validateJson(value.value)
    }

    const handleOnFocus = () => {
      isFocused.value = true
    }

    return {
      value,
      jsonerror,
      textArea,
      isFocused,
      isJsonValid,
      handleOnBlur,
      handleOnFocus,
      handleUpdateValue
    }
  }
})
</script>
