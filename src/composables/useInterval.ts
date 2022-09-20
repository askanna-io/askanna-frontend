export default function () {
  const intervalKeys = ref<string[]>([])
  const generalStore = useGeneralStore()

  const interval = computed(() => generalStore.interval)

  const setIntervalFn = (key: string, handler: TimerHandler) => {
    intervalKeys.value.push(key)
    // @ts-expect-error
    generalStore.setInterval({ key, handler }, 5000)
  }
  // @ts-expect-error
  const isSet = key => interval.value.has(key)

  // @ts-expect-error
  const clearIntervalFn = key => generalStore.clearInterval(key)

  onUnmounted(() => {
    intervalKeys.value.forEach(key => clearIntervalFn(key))
  })

  return {
    interval: interval.value,

    isSet,
    setIntervalFn,
    clearIntervalFn
  }
}
