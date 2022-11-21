<template>
  <AskAnnaToolbar dense flat class="br-r4 rounded-0 br-t-b br-color-grey package-toolbar">
    <AskAnnaFlex class="d-flex">
      <div class="mr-auto d-flex align-center overflow-x-overlay">
        <slot name="left" />
        <div class="askAnna-breadcrumbs">
          <VBreadcrumbs :items="breadcrumbs" class="pa-0 pl-1">
            <template v-slot:item="{ item }">
              <AskAnnaTooltip v-if="item.showTooltip" top content-class="opacity-1" v>
                <template v-slot:activator="{ on }">
                  <VBreadcrumbsItem
                    class="text-body-2"
                    :class="{ 'pr-2': !$vuetify.breakpoint.xsOnly }"
                    v-on="on"
                    :to="item.to"
                    :exact="item.exact"
                    :disabled="item.disabled"
                  >
                    {{ item.title }}
                  </VBreadcrumbsItem>
                </template>
                <span v-html="item.tooltip" />
              </AskAnnaTooltip>
              <VBreadcrumbsItem v-else :to="item.to" :exact="item.exact" :disabled="item.disabled">
                {{ item.title }}
              </VBreadcrumbsItem>
            </template>
          </VBreadcrumbs>
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
<style lang="scss">
.mobile-view {
  .package-toolbar {
    .v-toolbar__content {
      padding-right: 0px;
    }
  }
}
</style>
