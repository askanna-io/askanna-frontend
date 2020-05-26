import { Server } from 'miragejs'
import { createServer } from '@/server'
import packages from '@/server/fixtures/packages'
import { actions } from '@/features/packages/store/actions'

let server: Server

beforeEach(() => {
  server = createServer()
})

afterEach(() => {
  server.shutdown()
})

describe('packages actions', () => {
  it('can GET /getProjectPackages list', async () => {
    const projectUuid = '7MQT-6309-9g3t-R5QR'
    const commit = jest.fn()
    const getProjectPackages = actions.getProjectPackages as Function

    await getProjectPackages({ commit }, projectUuid)
    await expect(commit).toHaveBeenCalledWith('SET_PROJECT_PACKAGES', {
      packages
    })
  })
})
