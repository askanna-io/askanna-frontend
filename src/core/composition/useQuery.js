import { reactive } from '@vue/composition-api'

export default function() {
  const params = reactive({
    count: 0,
    results: []
  })

  return { params }
}
