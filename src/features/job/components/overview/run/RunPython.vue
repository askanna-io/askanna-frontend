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
          Python: example with
          <a
            target="_blank"
            class="no-underline"
            href="https://docs.askanna.io/python-sdk/"
          >the AskAnna SDK</a>
        </div>
        <AskAnnaButton
          prependIcon="mdi-content-copy"
          @click="handleCopy(pythonCode)"
        >
          Copy
        </AskAnnaButton>
      </div>
    </AskAnnaToolbar>
    <TheHighlight
      roundedBottom
      class="curl-code"
      :value="pythonCode"
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
        <div class="cursor-text">
          Python: example with
          <a
            target="_blank"
            class="no-underline"
            href="https://requests.readthedocs.io"
          >the Requests package</a>
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
            @click="handleCopy(getPythonCode2)"
          >
            Copy
          </AskAnnaButton>
        </div>
      </div>
    </AskAnnaToolbar>
    <TheHighlight
      roundedBottom
      class="curl-code"
      languageName="python"
      :value="getPythonCode2"
    />
  </VSheet>
</template>

<script setup lang="ts">
import { apiUrl } from '@/services/api-settings'

const copy = useCopy()
const jobStore = useJobStore()
const authStore = useAuthStore()
const { route } = useRouterAskAnna()

const hideToken = ref(true)
const authToken = computed(() => (hideToken.value ? '***masked***' : authStore.authToken))

const { jobId } = route.params
const pythonCode = `import askanna

data = {
    "parameter": "test",
    "data": {
        "foo": "bar",
        "bar": "foo",
    },
}

askanna.run.start(job_name="${jobStore.job.name}", data=data)

print(askanna.run.status())`

const getPythonCode2 = computed(
  () => `import requests

url = "${apiUrl}/v1/job/${jobId}/run/request/batch/"
headers = {'Authorization': "Token ${authToken.value}"}
data = {
    "parameter": "test",
    "data": {
        "foo": "bar",
        "bar": "foo",
    },
}

response = requests.post(
    url=url,
    headers=headers,
    json=data
)

print(response.status_code)
print(response.json())`
)

const handleCopy = (code: string) => copy.handleCopyText(code)
</script>
<style>
.curl-code code {
  white-space: pre-wrap;
}
</style>
