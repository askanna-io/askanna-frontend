import { Model, Server } from 'miragejs'

export function makeServer({ environment = 'development' } = {}) {
  const apiUrl = `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}/`

  const server: Server = new Server({
    environment,
    models: {
      user: Model
    },
    seeds(server: Server) {
      server.create('user', { id: 'Bob', name: 'ASDA' })
      server.create('user', { id: 'Alice', name: 'ASDA' })
    },
    routes() {
      this.passthrough()
      this.passthrough('https://cdn-api.askanna.eu/**')

      this.namespace = '/v1'
      this.urlPrefix = apiUrl
      this.timing = 400

      this.get('/todos', () => {
        return {
          todos: [{ id: '1', text: 'Migrate to TypeScript', isDone: false }]
        }
      })

      this.passthrough()
      this.passthrough(apiUrl)
      this.passthrough(`${apiUrl}/rest-auth/login/`)
      this.passthrough('https://cdn-api.askanna.eu/files/blob/**')
    }
  })

  return server
}

interface Movie {
  title: string
}
