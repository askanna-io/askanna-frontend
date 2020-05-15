import Vue from 'vue'
import Router from 'vue-router'
import Vuetify from 'vuetify'

import { shallowMount, createLocalVue, Wrapper, mount } from '@vue/test-utils'
import CompositionApi from '@vue/composition-api'
import hooks from '@u3u/vue-hooks'
import { workspace } from '@/features/workspace/store'
import workspaceConfig from '@/features/workspace/config'

import Vuex, { StoreOptions } from 'vuex'
import VueRouter from 'vue-router'

const createRouter = () => {
  return new Router({
    routes: [
      ...workspaceConfig.paths,
      {
        path: '*',
        redirect: '/login'
      }
    ],
    mode: 'history',
    base: process.env.BASE_URL
  })
}

const createStore = (initialState: any) => {
  const state = { ...workspace.state, ...initialState.state }
  const moduleStore = { workspace: { ...workspace, state } }
  const store: StoreOptions<RootState> = {
    modules: { ...moduleStore },
    state: {
      version: '1.0.0',
      loading: false
    },

    mutations: {},
    actions: {}
  }

  return new Vuex.Store<RootState>(store)
}
Vue.use(Vuetify)

export const createWrapper = (component: any, options = {}, initialState = {}) => {
  let wrapper: Wrapper<Vue>
  const vuetify = new Vuetify()

  const localVue = createLocalVue()

  localVue.use(VueRouter)
  localVue.use(Vuex)

  localVue.use(CompositionApi)
  localVue.use(hooks)

  const router = createRouter()
  const store = createStore(initialState)

  wrapper = mount<Vue>(component, {
    vuetify,
    localVue,
    router,
    store,
    ...options,
    stubs: ['the-snack-bar']
  })

  return { wrapper, store, router }
}
