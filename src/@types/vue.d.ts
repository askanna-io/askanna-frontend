import Vue from 'vue'
import moment from 'moment'

declare module 'vue/types/vue' {
  interface Vue {
    $moment: typeof moment
  }
}
