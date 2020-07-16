<template>
  <div>
    <v-snackbar
      :value="snackbar.open"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      :multi-line="uploads.length > 1"
      top
      right
      app
    >
      <div class="d-flex">
        <div class="mr-auto">
          Upload statuses:
        </div>
        <div>
          <v-btn dark x-small text @click="closeSnackBar">
            Close
          </v-btn>
        </div>
        <div v-show="isUploadListNotEmpty">
          <v-btn dark x-small text @click="clearSnackBar">
            Clear
          </v-btn>
        </div>
      </div>
      <v-divider class="mb-1" />

      <template v-if="snackbar.message">{{ snackbar.message }}</template>
      <div v-for="(item, index) in uploads" v-bind:key="item.id + index">
        <small
          ><v-btn
            x-small
            link
            depressed
            text
            :to="{
              name: 'workspace-project-package',
              params: {
                projectId: item.projectId,
                packageId: item.packageId
              }
            }"
            >{{ item.name }}</v-btn
          ></small
        >
        <v-progress-linear class="mt-1" :buffer-value="item.progress" stream color="white" />
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'
import useUploadStatus from './useUploadStatus'

export default defineComponent({
  name: 'TheUploadStatus',

  setup(props, context) {
    const state = useUploadStatus()

    const isUploadListNotEmpty = computed(() => state.uploads.value.length)

    return {
      ...state,
      isUploadListNotEmpty
    }
  }
})
</script>
