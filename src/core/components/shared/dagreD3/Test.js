import Vue from 'vue/dist/vue.js'

export default Vue.component('Test', {
  props: {
    string: {
      required: true,
      type: String
    }
  },
  render(h) {
    const render = {
      template: '<div>' + 'asdddddddddddddddddddd' + '</div>',
      methods: {
        markComplete() {}
      }
    }
    return h(render)
  }
})
