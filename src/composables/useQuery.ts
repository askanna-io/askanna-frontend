export default function ({ next, queryParams = {}, suuid, offset, limit, storeAction, loading }: any) {
  const currentScrollTop = ref(0)
  const richedOffset = ref(offset)

  const onScroll = (scrollTop: number) => {
    if (scrollTop > currentScrollTop.value && next.value) {
      currentScrollTop.value = scrollTop
      storeAction({
        suuid,
        loading,
        params: { limit, offset: richedOffset.value, ...queryParams.value }
      })
      richedOffset.value += limit
    }
  }

  const resetParams = () => {
    richedOffset.value = offset
    currentScrollTop.value = 0
  }

  return { onScroll, resetParams }
}
