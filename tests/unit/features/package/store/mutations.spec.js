import { mutations } from '@/features/package/store/mutations'
import * as type from '@/features/package/store/types'
import * as data from './data'

describe('package muttions', () => {
  it('SET_PACKAGE should update state with data in payload', () => {
    const state = {
      packageData: {}
    }

    const re = /(?:\.([^.]+))?$/
    const files = data.packageData.files.map(file => {
      const fileExt = re.exec(file.name)
      const ext = (!file.is_dir && fileExt && typeof fileExt[1] !== 'undefined' && fileExt[1]) || 'txt'

      return { ...file, ext }
    })

    mutations[type.SET_PACKAGE](state, { packageData: data.packageData })
    expect(state.packageData).toStrictEqual({ ...data.packageData, files })
  })

  it('SET_FILE should set state with payload', () => {
    const state = {
      file: '',
      projefileSourcectPackageHistory: ''
    }

    mutations[type.SET_FILE](state, data.packages)
    expect(state).toStrictEqual({ file: 'test', projefileSourcectPackageHistory: 'test' })
  })
})
