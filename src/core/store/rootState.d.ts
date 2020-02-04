interface RootState {
  version: string
  loading: boolean

  [moduleName: string]: any
}
