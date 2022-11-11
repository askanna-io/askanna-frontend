import _Vue from 'vue'

type rule<T> = (errorMessage: string, length?: number) => T
type ruleFunction = (suuid: string) => void

interface Rules {
  [ruleName: string]: rule<ruleFunction>
}

const RULE: Rules = {
  required: errorMessage => {
    return (v: any) => !!v || `${errorMessage}`
  },
  max: (errorMessage, maxLength = 100) => {
    return v => v.length <= maxLength || `${errorMessage}`
  },
  min: (errorMessage, minLength = 3) => {
    return v => (!v ? `${errorMessage}` : v.length >= minLength || `${errorMessage}`)
  },
  email: errorMessage => {
    return v => /^\w+([.-]?\w+)+([+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(v) || `${errorMessage}`
  },
  maxVal: (errorMessage, maxValue = 100) => {
    return (v: any) => v <= maxValue || `${errorMessage}`
  },
  minVal: (errorMessage, minValue = 0) => {
    return (v: any) => v > minValue || `${errorMessage}`
  },
  onlyPositiveNumbers: errorMessage => {
    return (v: any) => v >= 0 || `${errorMessage}`
  }
}

export function validationRules(Vue: typeof _Vue, options?: any): void {
  Vue.prototype.RULE = RULE
}

export default validationRules
