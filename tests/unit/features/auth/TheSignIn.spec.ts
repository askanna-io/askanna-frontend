import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import TheSignIn from '@/features/auth/components/TheSignIn.vue'
import { shallowMount, createLocalVue, Wrapper, mount } from '@vue/test-utils'

Vue.use(Vuetify)
const router = new VueRouter()

describe('TheSignIn.vue', () => {
  let wrapper: Wrapper<Vue>
  let vuetify

  beforeEach(() => {
    const localVue = createLocalVue()

    vuetify = new Vuetify()
    localVue.use(VueRouter)

    wrapper = mount<Vue>(TheSignIn, {
      router,
      vuetify,
      localVue,
      stubs: ['the-snack-bar']
    })
  })

  it('should render TheSignIn like instance of Vue', async () => {
    wrapper.vm.$nextTick()
    expect(wrapper.isVueInstance()).toBeTruthy()
    expect(wrapper.exists()).toBe(true)
  })
})
