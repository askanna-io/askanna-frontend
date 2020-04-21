import _Vue from 'vue'

export default function Beta(Vue: typeof _Vue, options?: any): void {
  console.log('process.env.VUE_APP_IS_BETA', process.env.VUE_APP_IS_BETA)
  Vue.prototype.isNotBeta = process.env.VUE_APP_IS_BETA === 'off'
}
