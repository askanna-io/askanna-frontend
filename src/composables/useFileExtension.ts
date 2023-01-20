export default () => {
  const extenstions = {
    pdf: ['pdf'],
    xls: ['xls', 'xlsx'],
    csv: ['csv', 'tsv'],
    noPreview: ['pkl', 'parquet'],
    images: ['jpg', 'png', 'gif', 'jpeg'],
    notShowCopyBtn: ['pdf', 'pkl', 'parquet', 'xls', 'xlsx'],
    isRendered: ['html', 'json', 'md', 'markdown', 'csv', 'tsv'],
    bigPreview: ['html', 'ipynb', 'csv', 'tsv', 'xls', 'xlsx', 'pdf'],
    code: ['xml', 'csv', 'tsv', 'plain', 'json', 'md', 'py', 'txt', 'yml', 'ini', 'toml', 'markdown']
  }
  return extenstions
}
