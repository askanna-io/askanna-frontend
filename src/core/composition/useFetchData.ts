import { useStore } from '@u3u/vue-hooks'

export default () => {
  const fetchData = (...params: any) => {
    const store = useStore()

    return (async () => {
      for (const action of params) {
        if (Array.isArray(action)) {
          await Promise.all(
            action.map(el => {
              if (typeof el === 'function') {
                return el()
              }

              if (typeof el === 'string') {
                return store.value.dispatch(el)
              }
            })
          )
        }

        if (typeof action === 'string') {
          await store.value.dispatch(action)
        }

        if (typeof action === 'function') {
          action()
        }
      }
    })()
  }

  return fetchData
}
