import jobs from './fixtures/jobs'
import jobruns from './fixtures/jobruns'
import payloads from './fixtures/payloads'
import packages from './fixtures/packages'
import projects from './fixtures/projects'
import workspaces from './fixtures/workspaces'
import { Model, Server, Factory } from 'miragejs'

export function createServer({ environment = 'development' } = {}) {
  const apiUrl = `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}/`

  const server: Server = new Server({
    environment,
    fixtures: {
      jobs,
      jobruns,
      packages,
      payloads,
      projects,
      workspaces
    },
    models: {
      workspace: Model,
      workspaces: Model,
      project: Model,
      projects: Model,
      jobs: Model,
      jobruns: Model,
      payloads: Model,
      payload: Model,
      packages: Model,
      package: Model
    },
    factories: {
      workspace: Factory.extend({
        title: 'Movie title'
      })
    },
    seeds(server: Server) {
      server.loadFixtures()
    },
    routes() {
      this.namespace = '/v1'
      this.urlPrefix = apiUrl
      this.timing = 400

      this.get('/workspace', (schema: any, request) => {
        return schema.workspaces.all()
      })

      this.get('/workspace/:id', (schema, request) => {
        let short_uuid = request.params.id
        return schema.db.workspaces.findBy({ short_uuid })
      })

      this.get('/workspace/:id/projects', (schema, request) => {
        let workspace = request.params.id

        return schema.db.projects.where({ workspace })
      })

      this.get('/project', (schema: any) => {
        return schema.projects.all()
      })

      this.get('/project/:id', (schema, request) => {
        let short_uuid = request.params.id
        return schema.db.projects.findBy({ short_uuid })
      })

      this.get('/project/:id/jobs', (schema: any) => {
        return schema.jobs.all()
      })

      this.get('/project/:id/packages/', (schema: any) => {
        return schema.packages.all()
      })

      this.get('/project/:id/packages/:packageId/', (schema: any, request) => {
        let uuid = request.params.packageId
        return schema.db.packages.findBy({ uuid })
      })

      this.get('/job', (schema: any) => {
        return schema.jobs.all()
      })

      this.get('/job/:id', (schema: any, request) => {
        let short_uuid = request.params.id
        return schema.db.jobs.findBy({ short_uuid })
      })

      this.post('/job/:id/start/', (schema: any, request) => {
        let short_uuid = request.params.id
        return schema.db.jobs.findBy({ short_uuid })
      })

      this.post('/job/:id/stop/', (schema: any, request) => {
        let short_uuid = request.params.id
        return schema.db.jobs.findBy({ short_uuid })
      })

      this.post('/job/:id/pause/', (schema: any, request) => {
        let short_uuid = request.params.id
        return schema.db.jobs.findBy({ short_uuid })
      })

      this.post('/job/:id/reset/', (schema: any, request) => {
        let short_uuid = request.params.id
        return schema.db.jobs.findBy({ short_uuid })
      })

      this.put('/job/:id', function (schema: any, request) {
        let short_uuid = request.params.id
        let job = schema.db.jobs.findBy({ short_uuid })

        return { ...job, name: 'updated name', title: 'new titile', description: 'some job description' }
      })

      this.get('/job/:id/runs/', (schema: any) => {
        return schema.jobruns.all()
      })

      this.get('/jobrun/:id/', function (schema: any, request) {
        let short_uuid = request.params.id
        let jobrun = schema.db.jobruns.findBy({ short_uuid })

        return jobrun
      })

      this.get('/jobrun/:jobRunShortId/payload/:payloadUuid/', function (schema: any, request) {
        const { payloadUuid } = request.params
        const payload = schema.db.payloads.findBy({ uuid: payloadUuid })

        return payload.data
      })

      this.passthrough()
      this.passthrough(apiUrl)
      this.passthrough(`${apiUrl}/rest-auth/login/`)
      this.passthrough('https://cdn-api.askanna.eu/**')
    }
  })

  return server
}

interface Movie {
  title: string
}
