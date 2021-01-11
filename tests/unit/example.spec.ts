import Vue from 'vue'
import Vuetify from 'vuetify'
import App from '@/core/App.vue'
import VueRouter from 'vue-router'
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils'

Vue.use(Vuetify)
const router = new VueRouter()

describe('App.vue', () => {
  let wrapper: Wrapper<Vue>
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
    const localVue = createLocalVue()
    localVue.use(VueRouter)

    wrapper = shallowMount(App, {
      router,
      vuetify,
      localVue,
      stubs: ['the-snack-bar']
    })
  })

  it('should render App like instance of Vue', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.exists()).toBe(true)
  })
})
