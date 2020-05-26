import { mutations } from '@/features/packages/store/mutations'
import * as type from '@/features/packages/store/types'
import * as data from './data'

describe('packages muttions', () => {
  it('SET_PROJECT_PACKAGES should update state with data in payload', () => {
    const state = {
      projectPackages: [],
      projectPackageHistory: []
    }

    const dataPackges = data.packages.map((el, versionId) => {
      return { ...el, versionId }
    })
    const mutatedState = {
      projectPackages: [dataPackges.pop()],
      projectPackageHistory: dataPackges
    }
    mutations[type.SET_PROJECT_PACKAGES](state, data.packages)
    expect(state).toStrictEqual(mutatedState)
  })

  it('RESET_STORE should reset state with empty []s', () => {
    const state = {
      projectPackages: [{ title: 'test' }],
      projectPackageHistory: [{ title: 'test' }]
    }

    const mutatedState = {
      projectPackages: [],
      projectPackageHistory: []
    }
    mutations[type.RESET_STORE](state, data.packages)
    expect(state).toStrictEqual(mutatedState)
  })
})
