<template>
  <div>
    <v-card
      v-if="isLoading"
      outlined
      class="pb-2"
      :class="[{ 'ma-0 my-2': fullWidth, 'ma-2 my-4': !fullWidth }, classes]"
    >
      <v-card-text class="text-center">
        <p class="mb-1">{{ loadingTitle }}</p>

        <v-progress-linear
          color="primary"
          class="mb-0"
          :buffer-value="bufferValue"
          :value="loadingProgress"
          :reverse="indeterminate"
        />
      </v-card-text>
    </v-card>
    <v-expand-transition>
      <slot v-if="!isLoading && !loading" />
    </v-expand-transition>
  </div>
</template>

<script setup lang="ts">
import { delay } from 'lodash'

const props = defineProps({
  classes: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: true
  },
  simulate: {
    type: Boolean,
    default: true
  },
  loadingTitle: {
    type: String,
    default: 'Anna is loading'
  }
})

const speed = ref(10)
const interval = ref(0)
const bufferValue = ref(100)
const isLoading = ref(false)
const loadingProgress = ref(0)
const indeterminate = ref(false)
const loadingState = computed(() => props.loading)

const startLoading = () => {
  isLoading.value = true
  clearInterval(interval.value)

  interval.value = setInterval(() => {
    if (loadingProgress.value > 99) {
      if (loadingState.value) {
        indeterminate.value = !indeterminate.value
        bufferValue.value = 0
        loadingProgress.value = -10
      }
    } else {
      if (!props.loading && isLoading.value) {
        stopLoading()
      }
    }
    loadingProgress.value += Math.random() * speed.value
  }, 100)
}

const stopLoading = () => {
  delay(
    () => {
      clearInterval(interval.value)
      indeterminate.value = false
      isLoading.value = false
      bufferValue.value = 100
      loadingProgress.value = 0
    },
    100,
    'later'
  )
}

watch(
  () => props.loading,
  val => {
    if (!val) {
      loadingProgress.value = 100

      stopLoading()

      return
    }
    if (val && !isLoading.value) {
      indeterminate.value = false
      bufferValue.value = 100
      startLoading()
    }
  }
)

onBeforeMount(() => {
  startLoading()
})
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>