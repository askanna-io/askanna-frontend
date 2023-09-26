import AskAnnaConf from '/askanna.conf.json'
import * as components from 'vuetify/components'
import * as labs from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import { createVuetify, ThemeDefinition } from 'vuetify'


import { VRadio } from 'vuetify/components/VRadio'
import { VSelect } from 'vuetify/components/VSelect'
import { VAvatar } from 'vuetify/components/VAvatar'
import { VToolbar } from 'vuetify/components/VToolbar'
import { VTextarea } from 'vuetify/components/VTextarea'
import { VBtnToggle } from 'vuetify/components/VBtnToggle'
import { VToolbarTitle } from 'vuetify/components/VToolbar'
import { VRadioGroup } from 'vuetify/components/VRadioGroup'
import { VInfiniteScroll } from 'vuetify/labs/VInfiniteScroll'
import { VProgressLinear } from 'vuetify/components/VProgressLinear'

export const AskAnnaLightTheme: ThemeDefinition = {
  dark: false,
  colors: AskAnnaConf.theme.colors
}

const vuetify = createVuetify({
  display: {
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
  },
  aliases: {
    AskAnnaRadio: VRadio,
    AskAnnaAvatar: VAvatar,
    AskAnnaToolbar: VToolbar,
    AskAnnaTextArea: VTextarea,
    AskAnnaBtnToggle: VBtnToggle,
    AskAnnaRadioGroup: VRadioGroup,
    AskAnnaSelectOutlined: VSelect,
    AskAnnaListTitle: VToolbarTitle,
    AskAnnaProgressLinear: VProgressLinear,
    AskAnnaInfiniteScroll: VInfiniteScroll,
  },
  defaults: {
    AskAnnaListTitle: {
      class: 'text-2xl pl-4'
    },
    AskAnnaTextArea: {
      color: 'primary',
      variant: "outlined"
    },
    AskAnnaRadio: {
      ripple: false,
      color: 'primary',
      density: 'compact',
      class: '[&>label]:opacity-100 opacity-100',
    },
    AskAnnaBtnToggle: {
      divided: true,
      mandatory: true,
      color: "primary",
      variant: "outlined",
      class: 'border-main',
    },
    AskAnnaProgressLinear: {
      height: '2',
      color: 'primary',
      indeterminate: true,
    },
    AskAnnaToolbar: {
      density: 'compact',
    },
    AskAnnaRadioGroup: {
      mandatory: true,
      'hide-details': true,
    },
    AskAnnaSelectOutlined: {
      color: 'primary',
      density: 'compact',
      variant: 'outlined'
    },
    AskAnnaInfiniteScroll: {
      color: 'primary'
    }
  },
  components: { ...components, ...labs },
  directives,
  theme: {
    defaultTheme: 'AskAnnaLightTheme',
    themes: {
      AskAnnaLightTheme
    }
  }
})


export default vuetify