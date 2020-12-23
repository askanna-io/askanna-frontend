<template>
  <v-card>
    <v-card-title class="break">Wait a moment while we are creating your account</v-card-title>
    <v-card-text class="pb-2 text-body-1">
      You can wait while Anna is creating your account. This can take a couple of seconds. You can also do something
      else. We will send you an email ones the account is ready.
    </v-card-text>
  </v-card>
</template>

<script>
import usePrepareAccount from '../../composition/usePrepareAccount'
import { ref, inject, computed, onBeforeMount, onUnmounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WaitBeforeCreateAccount',

  setup(rops, context) {
    const prepareAccount = usePrepareAccount(context)

    const authData = inject('authData')

    const polling = ref(null)
    const isReady = computed(() => prepareAccount.IsAccountReady.value)

    const checkIsReady = () => {
      polling.value = setInterval(async () => {
        await prepareAccount.checkIfWorkspaceIsReady({ ...authData.value })

        if (isReady.value) {
          clearInterval(polling.value)
          context.root.$router.push({ name: 'workspace', params: { workspaceId: prepareAccount.workspaceId.value } })
        }
      }, 5000)
    }

    onBeforeMount(async () => {
      checkIsReady()
    })

    onUnmounted(() => {
      clearInterval(polling.value)
    })
  }
})
</script>
<style scoped>
.break {
  word-break: normal;
}
</style>
