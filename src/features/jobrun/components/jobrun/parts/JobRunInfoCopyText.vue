<template>
  <div>
    {{ text }}:
    <ask-anna-copy-text
      :text="value"
      :iconColor="'grey lighten-2'"
      :buttonType="{ text: true }"
      :styleClasses="'px-0 white primary--black font-weight-regular  body-1'"
    />
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfoCopyText',

  props: {
    text: {
      type: String,
      default: ''
    },
    value: {
      type: String | Number,
      default: ''
    }
  }
})
</script>
