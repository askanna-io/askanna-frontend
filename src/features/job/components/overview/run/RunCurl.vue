<template>
  <div :class="{ 'px-4': !$vuetify.breakpoint.xsOnly, 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-toolbar dense flat color="grey lighten-4" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center">Shell</div>
        <div>
          <v-tooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" class="mr-1 btn--hover" outlined color="secondary" @click="handleCopy()">
                <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex class="mb-4">
      <TheHighlight class="curl-code" :value="curl" languageName="json" />
    </v-flex>
  </div>
</template>

<script setup lang="ts">
import { apiUrl } from '@/services/api-settings'

const copy = useCopy()
const jobStore = useJobStore()

const authStore = useAuthStore()
const { route } = useRouterAskAnna()
const { jobId } = route.params

const curl = `curl -X POST \\
-d '{"data": {"foo": "bar"}}' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Token ${authStore.authToken}' \\
'${apiUrl}/v1/run/${jobId}/'`

const handleCopy = () => copy.handleCopyText(curl)
</script>
<style>
.curl-code code {
  white-space: pre-wrap;
}
</style>
