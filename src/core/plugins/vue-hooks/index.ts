import { VueConstructor } from 'vue'
import { setRuntimeVM } from './runtime'

export { default as useRouter } from './useRouter'
export { default as useWindowSize } from './useWindowSize'

export default function install(Vue: VueConstructor) {
  Vue.mixin({ beforeCreate: setRuntimeVM })
}
