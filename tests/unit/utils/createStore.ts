import $axios from './createAxios'
import { api } from '@/core/services/api-settings'
import Vuex, { StoreOptions } from 'vuex'
import * as at from '@/core/store/actionTypes'
import { workspace } from '@/features/workspace/store'

export default (initialState: any) => {
  const state = { ...workspace.state, ...initialState.state }
  const moduleStore = { workspace: { ...workspace, state } }
  const store: StoreOptions<RootState> = {
    modules: { ...moduleStore },
    state: {
      version: '1.0.0',
      loading: false
    }
  }

  return new Vuex.Store<RootState>(store)
}
