import { get } from 'lodash'
import { ref, SetupContext } from '@vue/composition-api'

export default function (context: SetupContext, { store, action, queryPath, uuid }: any) {
  const currentScrollTop = ref(0)

  const richedOffset = ref(18)
  const onScroll = (scrollTop: number) => {
    if (scrollTop > currentScrollTop.value && get(store, `${queryPath}.value.next`)) {
      currentScrollTop.value = scrollTop
      store.setQuery({ path: `${queryPath}.offset`, value: richedOffset.value })
      store[action](uuid)
      richedOffset.value += 9
    }
  }

  return { onScroll }
}
