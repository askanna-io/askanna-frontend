import { set } from 'lodash'
interface MetricNameParams {
  order_by?: string
  metric_name?: string
  metric_type?: string
  metric_value?: string
}

export default function ({ context, routeName, typeName }) {
  const lastScrollTop = ref(0)
  const { route, replace } = useRouterAskAnna()

  const state = reactive({
    order_by: null,
    label_name: null,
    label_value: null,
    metric_value: null,
    metric_name: null,
    variable_type: null,
    variable_name: null,
    variable_value: null
  })

  const changeState = ({ path, value }: { path: string; value: string }) => {
    set(state, path, value)
    // reset last scroll position
    lastScrollTop.value = 0

    //change query in params
    replace({
      name: routeName,
      query: { ...route.query, [path]: value }
    })

    // emit event to parent component
    // the parent is where useSortFilterTable initialized
    emitSortFilter(state)
  }

  const metricNameParams = [`${typeName}_name`]
  const labalParams = ['label_name', 'label_value']
  const metricValueParams = [`${typeName}_type`, `${typeName}_value`]

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
      (state.order_by && state.order_by.includes('name'))
  )
  const isActiveMetricValue = computed(
    () =>
      Object.entries(state)
        .filter(([key, _]) => metricValueParams.includes(key))
        .some(([_, value]) => value) ||
      (state.order_by && state.order_by.includes('value'))
  )

  const emitSortFilter = (data: MetricNameParams) => {
    context.emit('onSort', {
      ...data,
      page_size: 100
    })
  }

  const initState = () => {
    const { order_by = '', metric_name, metric_value, metric_type, variable_name, variable_value, variable_type, label_name, label_value } = route.query
    Object.assign(state, { order_by, metric_name, metric_value, metric_type, variable_name, variable_value, variable_type, label_name, label_value })
  }

  // init state from route.query
  initState()

  provide('state', readonly(state))
  provide('changeState', changeState)

  provide('isActiveMetricName', readonly(isActiveMetricName))
  provide('isActiveMetricValue', readonly(isActiveMetricValue))
  provide('isActiveLabelFilter', readonly(isActiveLabelFilter))

  return { state, lastScrollTop }
}
