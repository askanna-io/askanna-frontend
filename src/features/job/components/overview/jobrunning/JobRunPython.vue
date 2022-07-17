<template>
  <div :class="{ 'px-4': !$vuetify.breakpoint.xsOnly, 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-toolbar dense flat color="grey lighten-4" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center">Shell</div>
        <div>
          <v-tooltip top content-class="opacity-1">
            <template v-slot:activator="{ on }">
              <v-btn class="mr-1 btn--hover" small v-on="on" outlined color="secondary" @click="handleCopy()">
                <v-icon left color="secondary">mdi-content-copy</v-icon>Copy
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex class="mb-4">
      <TheHighlight class="curl-code" :value="pythonCode" languageName="python" />
    </v-flex>
  </div>
</template>

<script lang="ts">
import useCopy from '@/core/composition/useCopy'
import { apiUrl } from '@/core/services/api-settings'
import { defineComponent } from '@vue/composition-api'
import { useAuthStore } from '@/features/auth/useAuthStore'

import TheHighlight from '@/core/components/highlight/TheHighlight.vue'

export default defineComponent({
  name: 'JobRunPython',

  components: { TheHighlight },

  setup(_, context) {
    const copy = useCopy()
    const authStore = useAuthStore()

    const { jobId } = context.root.$route.params
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

    return {
      pythonCode,
      handleCopy
    }
  }
})
</script>
<style>
.curl-code code {
  white-space: pre-wrap;
}
</style>
