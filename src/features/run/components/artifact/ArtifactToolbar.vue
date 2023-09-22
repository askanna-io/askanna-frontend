<template>
  <AskAnnaToolbar
    density="compact"
    flat
    class="br-r4 rounded-0 br-t-b br-color-grey"
  >
    <div class="flex">
      <div class="mr-auto flex items-center">
        <slot name="left" />
        <div>
          <VBreadcrumbs
            :items="breadcrumbs"
            class="p-0 pl-1"
          >
            <template v-slot:divider>
              <AskAnnaIcon>mdi-chevron-right</AskAnnaIcon>
            </template>
            <template v-slot:item="{ item }">
              <VBreadcrumbsItem
                :to="item.to"
                :exact="item.exact"
              >
                {{ item.title }}
              </VBreadcrumbsItem>
            </template>
          </VBreadcrumbs>
        </div>
      </div>
      <slot name="rigth" />
    </div>
  </AskAnnaToolbar>
</template>
<script setup lang="ts">
defineProps({
  breadcrumbs: {
    type: Array,
    default: () => []
  }
})
</script>
