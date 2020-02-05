import axios from 'axios'
import { AxiosRequestConfig } from 'axios'

import router from '@/core/router'

import * as mt from '@/core/store/mutationTypes'
import { apiStringify } from '@/core/api-settings'
import { api } from '@/core/api-settings'
import * as actionType from '@/core/store/actionTypes'

import { ActionTree } from 'vuex'
import { JobsState, JOBS_STORE } from './types'

const root = true
const serviceName = JOBS_STORE
const apiString = apiStringify(serviceName)

export const actions: ActionTree<JobsState, RootState> = {}
