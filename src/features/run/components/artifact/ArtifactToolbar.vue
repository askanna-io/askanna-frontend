<template>
  <AskAnnaToolbar dense flat class="br-r4 rounded-0 br-t-b br-color-grey">
    <AskAnnaFlex class="d-flex">
      <div class="mr-auto d-flex align-center">
        <slot name="left" />
        <div>
          <v-breadcrumbs :items="breadcrumbs" class="pa-0 pl-1">
            <template v-slot:divider>
              <AskAnnaIcon>mdi-chevron-right</AskAnnaIcon>
            </template>
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :to="item.to" :exact="item.exact">
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </div>
      </div>
      <slot name="rigth" />
    </AskAnnaFlex>
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
