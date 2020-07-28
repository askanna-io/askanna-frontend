<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-3" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center">
          Shell
        </div>
        <div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn small v-on="on" outlined color="secondary" @click="handleCopy()">
                <v-icon color="secondary">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-toolbar>
    <v-flex class="mb-4">
      <prism-editor class="curl-code" line-numbers :code="curl" readonly />
    </v-flex>
  </div>
</template>

<script>
import PrismEditor from 'vue-prism-editor'
import { url } from '@/core/services/api-settings'
import { defineComponent } from '@vue/composition-api'
import useJobStore from '@job/composition/useJobStore'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import useAuthStore from '@/features/auth/composition/useAuthStore'

export default defineComponent({
  name: 'JobRunCurl',

  components: { PrismEditor },

  setup(props, context) {
    const jobStore = useJobStore()
    const snackBar = useSnackBar()

    const authStore = useAuthStore()
    const { jobId } = context.root.$route.params

    const curl = `curl -X POST \\
-d '{"data": {"foo": "bar"}}' \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Token ${authStore.authToken.value}' \\
'${url}/v1/run/${jobId}'`

    const handleCopy = () => {
      context.root.$copyText(curl).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

    return {
      curl,
      ...jobStore,
      jobId,
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
