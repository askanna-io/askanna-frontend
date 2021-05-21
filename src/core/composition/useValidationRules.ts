import _Vue from 'vue'
import { reactive, toRefs } from '@vue/composition-api'

type rule<T> = (errorMessage: string, length?: number) => T
type ruleFunction = (uuid: string) => void

interface Rules {
  [ruleName: string]: rule<ruleFunction>
}
const emailPatern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

const rules: Rules = {
  required: errorMessage => {
    return (v: any) => !!v || `${errorMessage}`
  },
  max: (errorMessage, maxLength = 100) => {
    return v => (!v ? `${errorMessage}` : v.length <= maxLength || `${errorMessage}`)
  },
  min: (errorMessage, minLength = 3) => {
    return v => (!v ? `${errorMessage}` : v.length >= minLength || `${errorMessage}`)
  },
  email: errorMessage => {
    return v => emailPatern.test(v) || `${errorMessage}`
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

export function useValidationRules() {
  const RULES = reactive(rules)

  const isValidEmail = (email: string) => emailPatern.test(email)

  return { RULES, isValidEmail }
}

export default useValidationRules
