import { defineStore } from 'pinia'
import { set, debounce } from 'lodash'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const serviceName = 'run'
const api = apiStringify(serviceName)

export const useRunStore = defineStore('run', {
  state: () => {
    return {
      runs: {
        count: 0,
        next: null,
        results: []
      },
      openRunResult: false,
      run: {} as Run,
      newRun: {} as Run,
      runLoading: true,
      runStatusLoading: true,
      runsLoading: false,
      runlogLoading: true,
      runArtifactLoading: false,
      runLog: {
        count: 0,
        next: null,
        results: []
      },
      runLogFullVersion: [],
      runlogScrollLoading: false,
      variables_meta: { label_names: [] },
      artifactData: {} as Package
    }
  },

  actions: {
    async resetStore() {
      this.$reset()
    },

    showRunResult() {
      this.openRunResult = true
    },

    closeResultModal() {
      this.openRunResult = false
    },

    async getRun(uuid: string) {
      this.runLoading = true

      let run = { name: '' }

      try {
        run = await apiService({
          uuid,
          serviceName,
          action: api.getRun
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on run job in getRun action.\nError: ', e)

        this.$routerAskAnna.push({ name: 'workspace-project-job-run-does-not-exist' })

        return
      }

      this.run = run

      this.runLoading = false

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ runId: run.name })
    },

    async getRunStatus(runIdShortUuid: string, isNewRun: boolean = false) {
      this.runStatusLoading = true

      let status
      try {
        status = await apiService({
          serviceName,
          action: api.jobrunStatus,
          uuid: runIdShortUuid || this.run.short_uuid
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on getjob run status in getRunStatus action.\nError: ', e)

        return
      }

      if (isNewRun) {
        this.newRun = { ...this.newRun, ...status }
      } else {
        this.run = { ...this.run, ...status }
      }

      this.runStatusLoading = false
    },

    async startRun({ code, ...params }, uuid: string) {
      const logger = useLogger()

      let run
      try {
        run = await apiService({
          action: api.start,
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          uuid,
          params,
          data: code,
          serviceName
        })
      } catch (e) {
        logger.error('Error on start job in startJob action.\nError: ', e)
        return
      }
      logger.success('Job was started')

      this.newRun = run
    },

    async udapteRun({ uuid, data }) {
      let isUpdated = false
      let run = { name: '' }

      try {
        run = await apiService({
          uuid,
          data,
          serviceName,
          method: 'PATCH',
          action: api.getRun
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on udapte run job in udapteRun action.\nError: ', e)

        return
      }
      isUpdated = true

      this.run = run

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ runId: run.name })

      return isUpdated
    },

    async setLoading({ name, value }: { name: string; value: boolean }) {
      set(this, name, value)
    },

    async getInitRunLog(data) {
      this.runlogLoading = true

      await this.getRunLog(data)

      this.runlogLoading = false
    },

    async getRunLog({ uuid, params }) {
      const turnOnScrollLoading = () => {
        this.runlogScrollLoading = true
      }
      const throttled = debounce(turnOnScrollLoading, 1000, { trailing: false, leading: true })
      throttled()

      let runLog = {
        next: 0,
        count: 0,
        results: []
      }
      try {
        runLog = await apiService({
          uuid,
          params,
          serviceName,
          action: api.getRunLog
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on run log in getRunLog action.\nError: ', e)
      }

      const { count, next, results: list } = runLog

      this.runLog = {
        next,
        count,
        results: [...this.runLog.results, ...list]
      }

      const turnOffScrollLoading = () => {
        this.runlogScrollLoading = false
      }

      const throttledOff = debounce(turnOffScrollLoading, 2000, { trailing: false, leading: true })

      throttledOff()
    },

    async getFullVersionRunLog(uuid) {
      let runLog = {
        next: 0,
        count: 0,
        results: []
      }
      try {
        runLog = await apiService({
          action: api.getRunLog,
          serviceName,
          uuid
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on run log in getRunLog action.\nError: ', e)

        return
      }

      this.runLogFullVersion = runLog
    },

    async resetRunLog() {
      this.runLog = {
        next: '',
        count: 0,
        results: []
      }
    },

    async getInitialRunArtifact(params) {
      await this.getRunArtifact(params)
    },

    async getRunArtifact({ uuid, params }) {
      this.runArtifactLoading = true

      let data = {}
      try {
        data = await apiService({
          action: api.getRunArtifact,
          serviceName,
          uuid,
          params
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on data in getRunArtifact action.\nError: ', e)

        this.runArtifactLoading = false

        return
      }

      console.log(data)

      const re = /(?:\.([^.]+))?$/
      const files = data.files.map((file: File) => {
        const fileExt = re.exec(file.name)
        const ext = (!file.is_dir && fileExt && typeof fileExt[1] !== 'undefined' && fileExt[1]) || 'txt'

        return { ...file, ext }
      })

      this.artifactData = { ...data, files }
      this.runArtifactLoading = false
    },

    async downloadPackage(uuid) {
      const url = await this.getTargetPackage(uuid)

      return url
    },

    async getTargetPackage(uuid: string) {
      let packageTarget
      try {
        packageTarget = await apiService({
          uuid,
          serviceName,
          action: api.getDownloadLink
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on load packageTarget in getTargetPackage action.\nError: ', e)
        return ''
      }

      return packageTarget.target || ''
    },

    async deleteRunInfo({ short_uuid: uuid, name }) {
      const logger = useLogger()

      try {
        await apiService({
          uuid,
          serviceName,
          method: 'delete',
          action: api.delete
        })
        logger.success(`You have successfully deleted the run ${name || uuid}`)

        return true
      } catch (error) {
        logger.error('Error on delete runInfo in deleteRunInfo action.\nError: ', error)
      }
    }
  }
})
