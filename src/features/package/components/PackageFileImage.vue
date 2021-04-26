<template>
  <v-container class="pt-0 fill-height" fluid>
    <v-fade-transition mode="out-in">
      <v-row key="0">
        <v-col cols="12" class="pt-0">
          <v-card dark>
            <v-img dark :src="imgSrc" contain />
          </v-card>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'PackageFileImage',

  props: {
    fileSource: String | Blob
  },

  setup(props, context) {
    const imgSrc = computed(() => {
      const urlCreator = window.URL || window.webkitURL
      const imgSrc = urlCreator.createObjectURL(props.fileSource)

      return imgSrc
    })

    return {
      imgSrc
    }
  }
})
</script>
