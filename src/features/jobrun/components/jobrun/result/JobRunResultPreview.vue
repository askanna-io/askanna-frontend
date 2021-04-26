<script>
import ResultHTML from './types/ResultHTML'
import ResultJSON from './types/ResultJSON'
import ResultImage from './types/ResultImage'
import ResultDownloadableFile from './types/ResultDownloadableFile'

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunResultPreview',

  functional: true,

  props: {
    dataSource: {
      type: String | Blob,
      default: () => ''
    },
    fileExtension: {
      type: String,
      default: () => ''
    }
  },

  render(h, context) {
    const { fileExtension } = context.props
    const types = {
      txt: ResultJSON,
      xml: ResultJSON,
      csv: ResultJSON,
      html: ResultHTML,
      png: ResultImage,
      jpg: ResultImage,
      json: ResultJSON,
      jpeg: ResultImage,
      plain: ResultJSON,
      xls: ResultDownloadableFile,
      pdf: ResultDownloadableFile,
      xlsx: ResultDownloadableFile
    }
    const TypeComponent = types[fileExtension]

    return h(TypeComponent, { props: context.props })
  }
})
</script>
