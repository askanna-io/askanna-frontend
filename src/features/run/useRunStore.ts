import router from '@/core/router'
import { defineStore } from 'pinia'
import VueRouter from 'vue-router'
import { set, debounce } from 'lodash'
import { RunModel, ArtifactModel } from './types'
const { isNavigationFailure, NavigationFailureType } = VueRouter

import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
import { useGeneralStore } from '@/core/store/useGeneralStore'

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
      run: new RunModel().state,
      runLoading: true,
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
      artifactData: new ArtifactModel().state
    }
  },
  getters: {},

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
          action: api.getRun,
          serviceName,
          uuid
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on run job in getRun action.\nError: ', e)

        router.push({ name: 'workspace-project-job-run-does-not-exist' }).catch(failure => {
          if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
            logger.error('Error on redirect to workspace-project-job-run-does-not-exist.\nError: ', failure)
          }
        })

        return
      }

      this.run = run

      this.runLoading = false

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ runId: run.name })
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
      const turnOnScrollLoading = function () {
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

      const turnOffScrollLoading = function () {
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

    async getInitialRunArtifact(data) {
      await this.getRunArtifact(data)
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
