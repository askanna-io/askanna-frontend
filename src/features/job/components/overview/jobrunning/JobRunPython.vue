<template>
  <div class="px-4">
    <v-toolbar dense flat color="grey lighten-4" class="br-r4">
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center">
          Shell
        </div>
        <div>
          <v-tooltip top>
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
      <the-highlight class="curl-code" :value="pythonCode" languageName="python" />
    </v-flex>
  </div>
</template>

<script>
import { apiUrl } from '@/core/services/api-settings'
import { defineComponent } from '@vue/composition-api'
import useJobStore from '@job/composition/useJobStore'
import useSnackBar from '@/core/components/snackBar/useSnackBar'
import TheHighlight from '@/core/components/highlight/TheHighlight'
import useAuthStore from '@/features/auth/composition/useAuthStore'

export default defineComponent({
  name: 'JobRunPython',

  components: { TheHighlight },

  setup(props, context) {
    const jobStore = useJobStore()
    const snackBar = useSnackBar()
    const authStore = useAuthStore()

    const { jobId } = context.root.$route.params
    const pythonCode = `import requests

url = "${apiUrl}/v1/run/${jobId}/"
headers = {'Authorization': "Token ${authStore.authToken.value}"}
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

    const handleCopy = () => {
      context.root.$copyText(pythonCode).then(
        function (e) {
          snackBar.showSnackBar({ message: 'Copied', color: 'success' })
        },
        function (e) {
          snackBar.showSnackBar({ message: 'Can not copy', color: 'warning' })
        }
      )
    }

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
