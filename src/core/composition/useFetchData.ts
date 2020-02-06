export default function() {
  const fetchData = function(context, ...params) {
    return (async () => {
      for (let action of params) {
        if (Array.isArray(action)) {
          await Promise.all(
            action.map(el => {
              if (typeof el === 'function') {
                return el()
              }

              if (typeof el === 'string') {
                return context.$store.dispatch(el)
              }
            })
          )
        }

        if (typeof action === 'string') {
          await context.$store.dispatch(action)
        }

        if (typeof action === 'function') {
          action()
        }
      }
    })()
  }

  return fetchData
}
