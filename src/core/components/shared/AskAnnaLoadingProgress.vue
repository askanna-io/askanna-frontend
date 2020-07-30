<template>
  <div>
    <v-card v-if="isLoading" outlined class="ma-2 my-4 pb-2">
      <v-card-text class="text-center">
        <p class="mb-1">{{ loadingTitle }}</p>
        <v-progress-linear color="primary" rounded :value="loadingProgress" class="mb-0" query></v-progress-linear>
      </v-card-text>
    </v-card>
    <v-expand-transition>
      <slot v-if="!isLoading" />
    </v-expand-transition>
  </div>
</template>

<script>
import { delay } from 'lodash'
import { onUpdated, ref, watch, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaLoadingProgress',

  props: {
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
  },

  setup(props, context) {
    const speed = ref(10)
    const interval = ref(0)
    const isLoading = ref(true)
    const loadingProgress = ref(0)
    const loadingState = computed(() => props.loading)

    const startLoading = () => {
      clearInterval(interval.value)
      interval.value = setInterval(() => {
        if (!loadingState.value) {
          loadingProgress.value = 100
          stopLoading()

          return
        }
        /*  if (loadingState.value) {
          loadingProgress.value = 100
          speed.value = 30
        }
        if (loadingProgress.value >= 100) {
          if (loadingState.value) {
            loadingProgress.value = 3
          } else {
            clearInterval(interval.value)
            isLoading.value = false
            loadingProgress.value = 0
          }
        } */
        loadingProgress.value += Math.random() * speed.value
      }, 100)
    }

    const stopLoading = () => {
      delay(
        () => {
          clearInterval(interval.value)
          isLoading.value = false
        },
        350,
        'later'
      )
    }

    onUpdated(() => {
      if (!props.loading) {
      }
    })

    startLoading()

    return { isLoading, loadingProgress }
  }
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
