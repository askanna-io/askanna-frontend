import { get } from 'lodash'
import { ref } from '@vue/composition-api'

export default function ({ next, uuid, offset, limit, storeAction, loading }: any) {
  const currentScrollTop = ref(0)
  const richedOffset = ref(offset)

  const onScroll = (scrollTop: number) => {
    if (scrollTop > currentScrollTop.value && next.value) {
      currentScrollTop.value = scrollTop
      storeAction({ uuid, loading, params: { limit, offset: richedOffset.value } })
      richedOffset.value += limit
    }
  }

  return { onScroll }
}
