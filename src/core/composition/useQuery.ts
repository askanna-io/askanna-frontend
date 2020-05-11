import { reactive, SetupContext } from '@vue/composition-api'

export default function (context: SetupContext) {
  const params = reactive({
    count: 0,
    results: []
  })

  return { params }
}
