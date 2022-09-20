import Vue from 'vue'

interface Runtime {
  vm?: Vue
}

const runtime: Runtime = {}

export function getRuntimeVM(): Vue {
  if (runtime.vm) return runtime.vm
  throw new ReferenceError('[vue-hooks]Not found vue instance.')
}

export function setRuntimeVM(this: Vue, vue?: Vue) {
  const vm = this || vue
  if (typeof vm.$options.setup === 'function') {
    runtime.vm = vm
  }
}
