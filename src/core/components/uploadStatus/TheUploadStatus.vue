<template>
  <v-snackbar
    top
    app
    right
    :value="store.snackbar.open"
    :color="store.snackbar.color"
    :timeout="store.snackbar.timeout"
    :multi-line="store.uploads.length > 1"
  >
    <div class="d-flex">
      <div class="mr-auto">Upload statuses:</div>
      <div>
        <v-btn dark x-small text @click="store.closeSnackBar">Close</v-btn>
      </div>
      <div v-show="store.uploads.length">
        <v-btn dark x-small text @click="store.clearSnackBar">Clear</v-btn>
      </div>
    </div>
    <v-divider class="mb-1" />

    <template v-if="store.snackbar.message">{{ store.snackbar.message }}</template>
    <div v-for="(item, index) in store.uploads" v-bind:key="item.id + index">
      <small
        ><v-btn
          x-small
          link
          depressed
          text
          :to="{
            name: 'workspace-project-code',
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
</template>

<script ref setup lang="ts">
import { useUploadStatus } from './useUploadStatus'

const store = useUploadStatus()
</script>
