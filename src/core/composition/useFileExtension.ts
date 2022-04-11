export default () => {
  const extenstions = {
    xls: ['xls', 'xlsx'],
    csv: ['csv', 'tsv'],
    noPreview: ['pdf', 'pkl', 'parquet'],
    images: ['jpg', 'png', 'gif', 'jpeg'],
    notShowCopyBtn: ['pdf', 'pkl', 'parquet', 'xls', 'xlsx'],
    bigPreview: ['html', 'ipynb', 'csv', 'tsv', 'xls', 'xlsx'],
    isRendered: ['html', 'json', 'md', 'markdown', 'csv', 'tsv'],
    code: ['xml', 'csv', 'tsv', 'plain', 'json', 'md', 'py', 'txt', 'yml', 'ini', 'toml', 'markdown']
  }
  return extenstions
}
