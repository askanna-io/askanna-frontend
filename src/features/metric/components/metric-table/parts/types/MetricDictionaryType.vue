<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y top>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="cursor--pointer">
        <textarea
          readonly
          cols="80"
          :rows="calcRows"
          v-model="previewJson"
          class="noselect cursor--pointer"
          :style="{ resize: 'none' }"
        />
      </div>
    </template>
    <v-card>
      <v-app-bar dense height="40" flat>
        <v-spacer />
        <v-btn small outlined color="secondary" @click="handleCopy" class="mr-1 btn--hover">
          <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy JSON
        </v-btn>
        <v-btn small icon @click="handleClose">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
      <the-highlight :value="jsonString" languageName="json" />
    </v-card>
  </v-menu>
</template>
<script>
import useSlicedText from '@/core/composition/useSlicedText'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import { ref, computed, defineComponent } from '@vue/composition-api'
import TheHighlight from '@/core/components/highlight/TheHighlight'

export default defineComponent({
  name: 'MetricDictionaryType',

  props: {
    maxStringLength: {
      type: Number,
      default: () => 20
    },
    fullText: {
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
  },

  components: { TheHighlight },

  setup(props, context) {
    const snackBar = useSnackBar()

    const menu = ref(false)
    const BREAK_LINE_REGEXP = /\r\n|\r|\n/g

    const getLines = text => {
      if (text.length === 0) return []
      return text.split(BREAK_LINE_REGEXP)
    }
    const slicedText = useSlicedText()

    const maxLength = computed(() => {
      if (props.fullText) return 100
      return props.maxStringLength
    })

    const jsonString = computed(() => {
      let result = ''

      try {
        result = JSON.stringify(props.metricRow.value, null, 2)
      } catch (e) {
        return result
      }

      return result
    })

    const calcRows = computed(() => {
      let preview = getLines(jsonString.value)

      return preview.length > 6 ? 6 : preview.length
    })

    const previewJson = computed(() => {
      let preview = getLines(jsonString.value)
      if (preview.length > 6) {
        preview = preview.slice(0, 5)
        preview.push('...')
      }

      return preview.join('\n')
    })

    const handleClose = () => (menu.value = false)

    const handleCopy = async () => {
      context.root.$copyText(jsonString.value).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'failed' })
        }
      )
    }

    return { menu, maxLength, calcRows, slicedText, jsonString, previewJson, handleCopy, handleClose }
  }
})
</script>
<style>
.dictionary-type {
  opacity: 1 !important;
}
.noselect {
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
}

.noselect:focus {
  outline: none;
}
</style>
