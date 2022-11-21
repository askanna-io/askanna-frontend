import { set } from 'lodash'
interface MetricNameParams {
  ordering?: string
  metric_name?: string
  metric_type?: string
  metric_value?: string
}

export default function (context) {
  const lastScrollTop = ref(0)
  const { route, replace } = useRouterAskAnna()

  const state = reactive({
    ordering: '',
    label_name: '',
    label_value: '',
    metric_value: '',
    metric_name: '',
    variables_type: ''
  })

  const changeState = ({ path, value }: { path: string; value: string }) => {
    set(state, path, value)
    // reset last scroll position
    lastScrollTop.value = 0

    //change query in params
    replace({
      name: 'workspace-project-jobs-job-run-metrics',
      query: { ...route.query, [path]: value }
    })

    // emit event to parent component
    // the parent is where useSortFilterTable initialized
    emitSortFilter(state)
  }

  const metricNameParams = ['metric_name']
  const labalParams = ['label_name', 'label_value']
  const metricValueParams = ['metric_type', 'metric_value']

  const isActiveLabelFilter = computed(() =>
    Object.entries(state)
      .filter(([key, _]) => labalParams.includes(key))
      .some(([_, value]) => value)
  )
  const isActiveMetricName = computed(
    () =>
      Object.entries(state)
        .filter(([key, _]) => metricNameParams.includes(key))
        .some(([_, value]) => value) ||
      (state.ordering && state.ordering.includes('name'))
  )
  const isActiveMetricValue = computed(
    () =>
      Object.entries(state)
        .filter(([key, _]) => metricValueParams.includes(key))
        .some(([_, value]) => value) ||
      (state.ordering && state.ordering.includes('value'))
  )

  const emitSortFilter = (data: MetricNameParams) => {
    context.emit('onSort', {
      ...data,
      limit: 100,
      offset: 0
    })
  }

  provide('state', readonly(state))
  provide('changeState', changeState)

  provide('isActiveMetricName', readonly(isActiveMetricName))
  provide('isActiveMetricValue', readonly(isActiveMetricValue))
  provide('isActiveLabelFilter', readonly(isActiveLabelFilter))

  const initState = () => {
    const { ordering = '', metric_name, metric_value, metric_type, label_name, label_value } = route.query
    Object.assign(state, { ordering, metric_name, metric_value, metric_type, label_name, label_value })

    // emit event to parent component
    // the parent is where useSortFilterTable initialized
    emitSortFilter(state)
  }

  // init state from route.query
  initState()

  return { state, lastScrollTop }
}
