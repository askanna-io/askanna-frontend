import { GetterTree } from 'vuex'
import { userState } from './types'

export const getters: GetterTree<userState, RootState> = {
  globalPermission: state => state.globalProfile.permission
}
