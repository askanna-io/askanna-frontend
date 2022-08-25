import { getRuntimeVM } from './runtime'
import { computed } from '@vue/composition-api'

export default function useRouter() {
  const vm = getRuntimeVM()
  const route = computed(() => vm.$route)
  return { route, router: vm.$router }
}
