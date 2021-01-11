import moment from 'moment'

declare module 'vue/types/vue' {
  interface Vue {
    moment: typeof moment
  }
}

declare global {
  interface Window {
    Intercom: any
  }
}
