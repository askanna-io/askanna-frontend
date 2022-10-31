<template>
  <div :class="{ 'px-4': !$vuetify.breakpoint.xsOnly, 'px-0': $vuetify.breakpoint.xsOnly }">
    <AskAnnaToolbar dense flat color="grey lighten-4" class="br-r4">
      <AskAnnaFlex class="d-flex">
        <div class="mr-auto d-flex align-center">Shell</div>
        <div>
          <AskAnnaTooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <AskAnnaButton class="mr-1 btn--hover" small v-on="on" outlined color="secondary" @click="handleCopy()">
                <AskAnnaIcon left color="secondary">mdi-content-copy</AskAnnaIcon>Copy
              </AskAnnaButton>
            </template>
            <span>Copy</span>
          </AskAnnaTooltip>
        </div>
      </AskAnnaFlex>
    </AskAnnaToolbar>
    <AskAnnaFlex class="mb-4">
      <TheHighlight class="curl-code" :value="pythonCode" languageName="python" />
    </AskAnnaFlex>
  </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/services/api-settings'

const copy = useCopy()
const authStore = useAuthStore()
const { route } = useRouterAskAnna()

const { jobId } = route.params
const pythonCode = `import requests

url = "${apiUrl}/v1/run/${jobId}/"
headers = {'Authorization': "Token ${authStore.authToken}"}
data={
        "parameter": "test",
        "data": {
            "foo": "bar",
            "bar": "foo"
        }
     }

response = requests.post(url,
    headers=headers,
    json=data
)

print(response.status_code)
print(response.json())`

const handleCopy = () => copy.handleCopyText(pythonCode)
</script>
<style>
.curl-code code {
  white-space: pre-wrap;
}
</style>
