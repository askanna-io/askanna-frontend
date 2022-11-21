<template>
  <VSnackbar
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
        <AskAnnaButton dark x-small text @click="store.closeSnackBar">Close</AskAnnaButton>
      </div>
      <div v-show="store.uploads.length">
        <AskAnnaButton dark x-small text @click="store.clearSnackBar">Clear</AskAnnaButton>
      </div>
    </div>
    <AskAnnaDivider class="mb-1" />

    <template v-if="store.snackbar.message">{{ store.snackbar.message }}</template>
    <div v-for="(item, index) in store.uploads" v-bind:key="item.id + index">
      <small
        ><AskAnnaButton
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
          >{{ item.name }}</AskAnnaButton
        ></small
      >
      <VProgressLinear class="mt-1" :buffer-value="item.progress" stream color="white" />
    </div>
  </VSnackbar>
</template>

<script ref setup lang="ts">
const store = useUploadStatus()
</script>
