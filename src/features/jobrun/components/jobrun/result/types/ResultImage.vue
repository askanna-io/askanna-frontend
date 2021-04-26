<template>
  <img :src="imgSrc" />
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ResultImage',

  props: {
    dataSource: {
      type: String | Blob,
      default: function () {
        return ''
      }
    }
  },

  setup(props) {
    const imgSrc = computed(() => {
      if (!props.dataSource) return ''

      const urlCreator = window.URL || window.webkitURL
      const imgSrc = urlCreator.createObjectURL(props.dataSource)

      return imgSrc
    })

    return {
      imgSrc
    }
  }
})
</script>
