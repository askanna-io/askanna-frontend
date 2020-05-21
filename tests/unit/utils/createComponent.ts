import Vue from 'vue'
import Vuetify from 'vuetify'

import { shallowMount, createLocalVue, Wrapper, mount } from '@vue/test-utils'
import CompositionApi from '@vue/composition-api'
import hooks from '@u3u/vue-hooks'

import VueRouter from 'vue-router'
import Vuex, { StoreOptions } from 'vuex'

import createStore from './createStore'
import createRouter from './createRouter'

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
