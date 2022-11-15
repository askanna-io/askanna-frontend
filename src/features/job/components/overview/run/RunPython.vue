<template>
  <div>
    <div :class="{ 'px-4': !$vuetify.breakpoint.xsOnly, 'px-0': $vuetify.breakpoint.xsOnly }">
      <AskAnnaToolbar dense flat color="grey lighten-4" class="br-r4">
        <AskAnnaFlex class="d-flex">
          <div class="mr-auto d-flex align-center">
            Python: example with&nbsp;
            <a class="ask-anna-link" href="https://docs.askanna.io/python-sdk/" target="_blank">the AskAnna SDK</a>
          </div>
          <AskAnnaTooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                class="mr-1 btn--hover"
                small
                v-on="on"
                outlined
                color="secondary"
                @click="handleCopy(pythonCode)"
              >
                <AskAnnaIcon left color="secondary">mdi-content-copy</AskAnnaIcon>Copy
              </AskAnnaButton>
            </template>
            <span>Copy</span>
          </AskAnnaTooltip>
        </AskAnnaFlex>
      </AskAnnaToolbar>
      <AskAnnaFlex class="mb-4">
        <TheHighlight class="curl-code" :value="pythonCode" languageName="python" />
      </AskAnnaFlex>
    </div>
    <div :class="{ 'px-4': !$vuetify.breakpoint.xsOnly, 'px-0': $vuetify.breakpoint.xsOnly }">
      <AskAnnaToolbar dense flat color="grey lighten-4" class="br-r4">
        <AskAnnaFlex class="d-flex">
          <div class="mr-auto d-flex align-center">
            Python: example with&nbsp;
            <a class="ask-anna-link" href="https://requests.readthedocs.io" target="_blank">the Requests package</a>
          </div>
          <AskAnnaTooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                small
                v-on="on"
                outlined
                class="mr-1 btn--hover"
                :color="hideToken ? 'secondary' : 'primary'"
                @click="() => (hideToken = !hideToken)"
              >
                <AskAnnaIcon left small color="secondary">{{ 'far fa-eye' }}</AskAnnaIcon
                >{{ hideToken ? 'Show token' : 'Hide token' }}
              </AskAnnaButton>
            </template>
            <span>{{ hideToken ? 'Show token' : 'Hide token' }}</span>
          </AskAnnaTooltip>
          <AskAnnaTooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                class="mr-1 btn--hover"
                small
                v-on="on"
                outlined
                color="secondary"
                @click="handleCopy(getPythonCode2)"
              >
                <AskAnnaIcon left color="secondary">mdi-content-copy</AskAnnaIcon>Copy
              </AskAnnaButton>
            </template>
            <span>Copy</span>
          </AskAnnaTooltip>
        </AskAnnaFlex>
      </AskAnnaToolbar>
      <AskAnnaFlex class="mb-4">
        <TheHighlight class="curl-code" :value="getPythonCode2" languageName="python" />
      </AskAnnaFlex>
    </div>
  </div>
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
