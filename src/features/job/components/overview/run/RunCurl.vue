<template>
  <div>
    <div :class="{ 'px-4': !$vuetify.breakpoint.xsOnly, 'px-0': $vuetify.breakpoint.xsOnly }">
      <AskAnnaToolbar dense flat color="grey lighten-4" class="br-r4">
        <AskAnnaFlex class="d-flex">
          <div class="mr-auto d-flex align-center">
            Shell: example with&nbsp;
            <a class="ask-anna-link" href="https://docs.askanna.io/cli/" target="_blank">the AskAnna CLI</a>
          </div>
          <div class="d-flex">
            <AskAnnaTooltip top content-class="opacity-1">
              <template v-slot:activator="{ on }">
                <AskAnnaButton
                  small
                  v-on="on"
                  class="mr-1 btn--hover"
                  outlined
                  color="secondary"
                  @click="handleCopy(CI)"
                >
                  <AskAnnaIcon left color="secondary">mdi-content-copy</AskAnnaIcon>Copy
                </AskAnnaButton>
              </template>
              <span>Copy</span>
            </AskAnnaTooltip>
          </div>
        </AskAnnaFlex>
      </AskAnnaToolbar>
      <AskAnnaFlex class="mb-4">
        <TheHighlight class="curl-code" :value="CI" languageName="python" singleLine />
      </AskAnnaFlex>
    </div>
    <div :class="{ 'px-4': !$vuetify.breakpoint.xsOnly, 'px-0': $vuetify.breakpoint.xsOnly }">
      <AskAnnaToolbar dense flat color="grey lighten-4" class="br-r4">
        <AskAnnaFlex class="d-flex">
          <div class="mr-auto d-flex align-center">Shell: example with&nbsp;
            <a class="ask-anna-link" href="https://curl.se/" target="_blank">curl</a>
          </div>
          <div class="d-flex">
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
                  small
                  v-on="on"
                  outlined
                  color="secondary"
                  class="mr-1 btn--hover"
                  @click="handleCopy(getCurl)"
                >
                  <AskAnnaIcon left color="secondary">mdi-content-copy</AskAnnaIcon>Copy
                </AskAnnaButton>
              </template>
              <span>Copy</span>
            </AskAnnaTooltip>
          </div>
        </AskAnnaFlex>
      </AskAnnaToolbar>
      <AskAnnaFlex class="mb-4">
        <TheHighlight class="curl-code" :value="getCurl" languageName="python" />
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
