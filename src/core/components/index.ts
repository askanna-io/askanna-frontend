import Vue from 'vue'

const requireComponent = require.context('./', true, /\.vue$/)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = componentConfig.default.name
  if (componentName) {
    Vue.component(componentName, componentConfig.default || componentConfig)
  }
})
