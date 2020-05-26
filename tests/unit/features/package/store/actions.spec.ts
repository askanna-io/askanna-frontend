import { Server } from 'miragejs'
import { createServer } from '@/server'
import packages from '@/server/fixtures/packages'
import { actions } from '@/features/package/store/actions'

let server: Server

beforeEach(() => {
  server = createServer()
})

afterEach(() => {
  server.shutdown()
})

describe('package actions', () => {
  it('can GET /getPackage by uuid', async () => {
    const projectId = '7MQT-6309-9g3t-R5QR'
    const packageId = '2e516943-4b6a-430f-83ea-75d2e0ec2359'
    const commit = jest.fn()
    const getPackage = actions.getPackage as Function

    const packageData = packages.find(item => item.uuid === packageId)

    const uuid = { projectId, packageId }

    await getPackage({ commit }, uuid)
    await expect(commit).toHaveBeenCalledWith('SET_PACKAGE', {
      packageData,
      uuid
    })
  })
})
