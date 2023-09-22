export const FileIcons = {
  html: 'mdi-language-html5',
  js: 'mdi-nodejs',
  xml: 'mdi-xml',
  json: 'mdi-code-json',
  pdf: 'mdi-file-pdf-box',
  png: 'mdi-file-image',
  jpg: 'mdi-file-image',
  jpeg: 'mdi-file-image',
  md: 'mdi-language-markdown',
  csv: 'mdi-file-delimited-outline',
  txt: 'mdi-file-document-outline',
  yml: 'mdi-file-document-outline',
  rst: 'mdi-file-document-outline',
  gitignore: 'mdi-file-document-outline',
  in: 'mdi-file-settings',
  cfg: 'mdi-file-settings',
  xls: 'mdi-file-excel',
  xlsx: 'mdi-file-excel',
  py: 'mdi-language-python',
  ini: 'mdi-file-cog-outline',
  bat: 'mdi-file-cog-outline',
  ipynb: 'mdi-notebook'
}

export const headers = [
  {
    title: '',
    align: 'left',
    sortable: false,
    key: 'type',
    width: 10,
    isShowOnMobile: true,
    class: 'text-left text-main text-subtitle-2 font-bold'
  },
  {
    title: 'Name',
    align: 'left',
    sortable: true,
    key: 'name',
    isShowOnMobile: true,

    class: 'text-left text-main text-subtitle-2 font-bold'
  },
  { title: 'Size', key: 'size', isShowOnMobile: false, class: 'text-left text-subtitle-2 font-bold' },
  {
    title: 'Modified',
    key: 'last_modified',
    sortable: true,
    width: '30%',
    isShowOnMobile: true,
    class: 'text-left text-subtitle-2 font-bold'
  }
]
