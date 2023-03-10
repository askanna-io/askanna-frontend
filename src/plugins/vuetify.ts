import Vue from 'vue'
import Vuetify from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: '#5D3EB2',
        secondary: '#515151',
        accent: '#82B1FF',
        error: '#FF7872',
        info: '#FAED7A',
        success: '#49B0AD',
        warning: '#FFC107',
        failed: '#FF6F00'
      }
    }
  },
  icons: {
    iconfont: 'mdi'
  }
})
