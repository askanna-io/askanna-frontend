import useGeneralStore from '@/core/store/general/useGeneralStore'
import { ref, onUnmounted, computed } from '@vue/composition-api'

export default function () {
  const intervalKeys = ref<string[]>([])
  const generalStore = useGeneralStore()

  // @ts-expect-error
  const interval = computed(() => generalStore.interval.value)

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
