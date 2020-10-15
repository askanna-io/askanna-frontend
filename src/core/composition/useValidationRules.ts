import _Vue from 'vue'
import { reactive, toRefs } from '@vue/composition-api'

type rule<T> = (errorMessage: string, length?: number) => T
type ruleFunction = (uuid: string) => void

interface Rules {
  [ruleName: string]: rule<ruleFunction>
}

const emailPatern = /^\w+([.-]?\w+)+([+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/

const rules: Rules = {
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
