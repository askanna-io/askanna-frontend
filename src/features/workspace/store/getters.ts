import { GetterTree } from 'vuex'
import { workspaceState } from './types'

export const getters: GetterTree<workspaceState, RootState> = {
  currentPeoplePermission: state => state.currentPeople.permission,
  isWorkspacePublic: state => state.workspace.visibility === 'PUBLIC'
}
