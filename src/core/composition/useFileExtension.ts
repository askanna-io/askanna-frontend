export default () => {
  const extenstions = {
    csv: ['csv', 'tsv'],
    images: ['jpg', 'png', 'gif', 'jpeg'],
    bigPreview: ['html', 'ipynb', 'csv', 'tsv'],
    noPreview: ['xls', 'pdf', 'xlsx', 'pkl', 'parquet'],
    isRendered: ['html', 'json', 'md', 'markdown', 'csv', 'tsv'],
    code: ['xml', 'csv', 'tsv', 'plain', 'json', 'md', 'py', 'txt', 'yml', 'ini', 'toml', 'markdown']
  }
  return extenstions
}
