<template>
  <AskAnnaPageDoesNotExist pageTitle="workspace" outlined>
    <template v-slot:header v-if="isUserLoggedIn">
      <VBreadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <VBreadcrumbsItem :to="item.to" exact>
            {{ item.title }}
          </VBreadcrumbsItem>
        </template>
      </VBreadcrumbs>
    </template>
  </AskAnnaPageDoesNotExist>
</template>

<script setup lang="ts">
const { isUserLoggedIn } = usePermission()

const breadcrumbs = computed(() => [
  {
    title: 'Workspace does not exist',
    to: '',
    disabled: true
  }
])
</script>
