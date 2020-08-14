import { get } from 'lodash'
import { ref } from '@vue/composition-api'

export default function ({ offset, limit, store, action, queryPath, uuid }: any) {
  const currentScrollTop = ref(0)
  const richedOffset = ref(offset)

  const onScroll = (scrollTop: number) => {
    if (scrollTop > currentScrollTop.value && get(store, `${queryPath}.value.next`)) {
      currentScrollTop.value = scrollTop
      store[action]({ uuid, params: { limit, offset: richedOffset.value } })
      richedOffset.value += offset
    }
  }

  return { onScroll }
}
