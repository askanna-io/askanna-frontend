<script>
import ResultHTML from './types/ResultHTML'
import ResultJSON from './types/ResultJSON'
import ResultDownloadableFile from './types/ResultDownloadableFile'
import PackageFileImage from '@/features/package/components/PackageFileImage'

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunResultPreview',

  functional: true,

  props: {
    view: {
      type: String,
      default: () => 'pretty'
    },
    dataSource: {
      type: String | Blob,
      default: () => ''
    },
    fileExtension: {
      type: String,
      default: () => ''
    },
    maxHeight: {
      type: String,
      default: () => '100vh'
    }
  },

  render(h, context) {
    const { fileExtension } = context.props
    const types = {
      txt: ResultJSON,
      xml: ResultJSON,
      csv: ResultJSON,
      tsv: ResultJSON,
      html: ResultHTML,
      json: ResultJSON,
      plain: ResultJSON,
      png: PackageFileImage,
      jpg: PackageFileImage,
      jpeg: PackageFileImage,
      xls: ResultDownloadableFile,
      pdf: ResultDownloadableFile,
      xlsx: ResultDownloadableFile
    }
    const TypeComponent = types[fileExtension]

    return h(TypeComponent, { props: context.props })
  }
})
</script>
