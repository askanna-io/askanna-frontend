import { SetupContext } from '@vue/composition-api'

export default function() {
  const fetchData = function(context: SetupContext, ...params: any) {
    return (async () => {
      for (let action of params) {
        if (Array.isArray(action)) {
          await Promise.all(
            action.map(el => {
              if (typeof el === 'function') {
                return el()
              }

              if (typeof el === 'string') {
                return context.root.$store.dispatch(el)
              }
            })
          )
        }

        if (typeof action === 'string') {
          await context.root.$store.dispatch(action)
        }

        if (typeof action === 'function') {
          action()
        }
      }
    })()
  }

  return fetchData
}
