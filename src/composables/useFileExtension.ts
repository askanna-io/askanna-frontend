export default () => {
  const extenstions = {
    pdf: ['pdf'],
    xls: ['xls', 'xlsx'],
    csv: ['csv', 'tsv'],
    images: ['jpg', 'png', 'gif', 'jpeg'],
    notShowCopyBtn: ['pdf', 'pkl', 'parquet', 'xls', 'xlsx'],
    isRendered: ['html', 'json', 'md', 'markdown', 'csv', 'tsv'],
    bigPreview: ['html', 'ipynb', 'csv', 'tsv', 'xls', 'xlsx', 'pdf'],
    code: ['xml', 'csv', 'tsv', 'plain', 'json', 'md', 'py', 'txt', 'yml', 'ini', 'toml', 'markdown'],
    noPreview: ['h5', 'pkl', 'parquet', 'app', 'exe', 'com', 'dll', 'dmg', 'iso', 'jar', 'zip', 'ko', 'lib', 'so', 'dat', 'bin', 'cab']
  }
  return extenstions
}
