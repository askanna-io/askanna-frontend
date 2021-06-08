export interface metricState extends MetricState {}

export interface MetricState {
  isFiltered: boolean
  metrics: {
    count: number
    results: Metric[]
    next: null | string
  }
  metricJSON: {
    count: number
    results: Metric[]
    next: null | string
  }
  metricLabels: string[]
  metricFullData: string
  loading: {
    metric: Boolean
    metricJSON: Boolean
    metricByParams: Boolean
  }
}
interface Metric {
  name: string
  status: string
  email: string
  uuid: string
  short_uuid: string
  object_uuid: string
  workspace: {
    name: string
    short_uuid: string
    uuid: string
  }
  role: string
  job_title: string
  user: { name: string | null; short_uuid: string | null; uuid: string | null }
  front_end_url: string
}

export const METRIC_STORE = 'metric'

export const action = {
  getMetric: 'getMetric',
  setLoading: 'setLoading',
  clearMetric: 'clearMetric',
  setIsFiltered: 'setIsFiltered',
  getMetricJSON: 'getMetricJSON',
  getMetricLabels: 'getMetricLabels',
  getMetricInitial: 'getMetricInitial',
  getMetricByParams: 'getMetricByParams',
  getMetricFullData: 'getMetricFullData'
}

export const mutation = {
  SET_METRIC: 'SET_METRIC',
  SET_LOADING: 'SET_LOADING',
  CLEAR_METRIC: 'CLEAR_METRIC',
  SET_IS_FILTERED: 'SET_IS_FILTERED',
  SET_METRIC_INIT: 'SET_METRIC_INIT',
  SET_METRIC_JSON: 'SET_METRIC_JSON',
  SET_METRIC_LABELS: 'SET_METRIC_LABELS',
  SET_METRIC_FULL_DATA: 'SET_METRIC_FULL_DATA'
}

export const stateType = {
  metrics: 'metrics',
  loading: 'loading',
  isFiltered: 'isFiltered',
  metricJSON: 'metricJSON',
  metricLabels: 'metricLabels',
  metricFullData: 'metricFullData'
}
