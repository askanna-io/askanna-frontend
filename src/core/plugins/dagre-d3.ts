import _Vue from 'vue'
import * as d3 from 'd3'
import * as dagreD3 from 'dagre-d3'

export default function(Vue: typeof _Vue, options?: any): void {
  Vue.prototype.$d3 = d3
  Vue.prototype.$dagreD3 = dagreD3
}
