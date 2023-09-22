<template>
  <VSnackbar
    color="white"
    location="top right"
    content-class="p-0 m-0"
    class="mt-14 upload-status"
    location-strategy="connected"
    :timeout="store.snackbar.timeout"
    :model-value="store.snackbar.open"
    :multi-line="store.uploads.length > 1"
  >
    <AskAnnaCard variant="flat">
      <AskAnnaCardTitle class="pl-4">
        <div class="flex items-center justify-between">
          Upload status
          <AskAnnaSpacer />
          <AskAnnaButton
            class="ml-4"
            variant="text"
            icon="mdi-close"
            @click="close"
          />
        </div>
      </AskAnnaCardTitle>
      <AskAnnaCardText class="prose pt-0  pr-7">
        <div
          v-for="(item, index) in store.uploads"
          v-bind:key="item.id + index"
        >
          <RouterLink
            variant="text"
            size="default"
            class="px-0 normal-case w-10 no-underline "
            @click="handleOpenCode"
            :to="{
              name: 'workspace-project-code-package',
              params: {
                packageId: item.packageId,
                projectId: item.projectId,
                workspaceId: item.workspaceId,

              }
            }"
          >
            <p class="p-0 m-0 hover:text-primary font-normal text-base truncate text-ellipsis">{{ item.name }}</p>
          </RouterLink>
          <AskAnnaProgressLinear
            stream
            height="4"
            class="mt-1"
            :indeterminate="false"
            :buffer-value="item.progress"
          />
        </div>
      </AskAnnaCardText>
      <AskAnnaCardActions
        v-if="store.uploads.length"
        class="pl-4"
      >
        <AskAnnaButton @click="store.clearSnackBar">Clear upload statuses</AskAnnaButton>
      </AskAnnaCardActions>
    </AskAnnaCard>
  </VSnackbar>
</template>

<script ref setup lang="ts">
const store = useUploadStatus()

const close = () => store.snackbar.open = false

const handleOpenCode = () => {
  setTimeout(() => (location.reload(), 1000))
}
</script>
<style lang="css">
.upload-status .v-snackbar__content {
  @apply p-0 m-0;
}
</style>