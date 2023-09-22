<template>
  <VSheet
    rounded
    class="m-4 "
  >
    <AskAnnaToolbar
      flat
      class="rounded-t px-4"
    >
      <div class="flex w-full items-center justify-between">
        <div class="cursor-text">
          Shell: example with
          <a
            target="_blank"
            class="no-underline"
            href="https://docs.askanna.io/cli/"
          >the AskAnna CLI</a>
        </div>
        <div>
          <AskAnnaButton
            prependIcon="mdi-content-copy"
            @click="handleCopy(CI)"
          >
            Copy
          </AskAnnaButton>
        </div>
      </div>
    </AskAnnaToolbar>
    <TheHighlight
      :value="CI"
      singleLine
      roundedBottom
      class="curl-code"
      languageName="python"
    />
  </VSheet>

  <VSheet
    rounded
    class="m-4 mt-6"
  >
    <AskAnnaToolbar
      flat
      class="rounded-t px-4"
    >
      <div class="flex w-full items-center justify-between">
        <div class="cursor-text">Shell: example with
          <a
            target="_blank"
            class="no-underline"
            href="https://curl.se/"
          >curl</a>
        </div>
        <div class="flex gap-2">
          <AskAnnaButton
            prependIcon="mdi-eye"
            :color="hideToken ? 'secondary' : 'primary'"
            @click="() => (hideToken = !hideToken)"
          >
            {{ hideToken ? 'Show token' : 'Hide token' }}
          </AskAnnaButton>

          <AskAnnaButton
            prependIcon="mdi-content-copy"
            @click="handleCopy(getCurl)"
          >
            Copy
          </AskAnnaButton>
        </div>
      </div>
    </AskAnnaToolbar>
    <div class="mb-4">
      <TheHighlight
        class="curl-code"
        roundedBottom
        :value="getCurl"
        languageName="python"
      />
    </div>
  </VSheet>
</template>

<script setup lang="ts">
import { apiUrl } from '@/services/api-settings'

const copy = useCopy()
const jobStore = useJobStore()
const authStore = useAuthStore()
const { route } = useRouterAskAnna()

const { jobId } = route.params

const hideToken = ref(true)
const authToken = computed(() => (hideToken.value ? '***masked***' : authStore.authToken))

const CI = `askanna run "${jobStore.job.name}" --data '{"data": {"foo": "bar"}}'`

const getCurl = computed(
  () => `curl -X POST \\
-d '{"data": {"foo": "bar"}}' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Token ${authToken.value}' \\
'${apiUrl}/v1/job/${jobId}/run/request/batch/'`
)

const handleCopy = (code: string) => copy.handleCopyText(code)
</script>
<style>
.curl-code code {
  white-space: pre-wrap;
}
</style>
