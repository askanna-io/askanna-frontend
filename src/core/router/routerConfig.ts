const routerConfig: RouterConfig = {
  signin: {
    layout: 'login',
    isShowSecondNavBar: false
  },
  signup: {
    layout: 'login',
    isShowSecondNavBar: false
  },
  join: {
    layout: 'login',
    isShowSecondNavBar: false
  },
  ['account-reset-password']: {
    layout: 'login',
    isShowSecondNavBar: false
  },

  ['forgot-password']: {
    layout: 'login',
    isShowSecondNavBar: false
  }
}

interface RouterConfig {
  [routeName: string]: {
    layout: string
    isShowSecondNavBar: boolean
  }
}

export { routerConfig, RouterConfig }
