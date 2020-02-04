const routerConfig: RouterConfig = {
  login: {
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
