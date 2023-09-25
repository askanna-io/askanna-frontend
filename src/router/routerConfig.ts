const routerConfig: RouterConfig = {
  signin: {
    layout: 'login'
  },
  signup: {
    layout: 'login'
  },
  join: {
    layout: 'login'
  },
  ['account-reset-password']: {
    layout: 'login'
  },
  ['forgot-password']: {
    layout: 'login'
  },
}

interface RouterConfig {
  [routeName: string]: {
    layout: string
  }
}

export { routerConfig, RouterConfig }
