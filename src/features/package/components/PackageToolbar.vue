<template>
  <v-toolbar dense flat class="br-r4 rounded-0 br-t-b br-color-grey package-toolbar">
    <v-flex class="d-flex">
      <div class="mr-auto d-flex align-center overflow-x-overlay">
        <slot name="left" />
        <div class="askAnna-breadcrumbs">
          <v-breadcrumbs :items="breadcrumbs" class="pa-0 pl-1">
            <template v-slot:item="{ item }">
              <v-tooltip v-if="item.showTooltip" top content-class="opacity-1" v>
                <template v-slot:activator="{ on }">
                  <v-breadcrumbs-item
                    class="text-body-2"
                    :class="{ 'pr-2': !$vuetify.breakpoint.xsOnly }"
                    v-on="on"
                    :to="item.to"
                    :exact="item.exact"
                    :disabled="item.disabled"
                  >
                    {{ item.title }}
                  </v-breadcrumbs-item>
                </template>
                <span v-html="item.tooltip" />
              </v-tooltip>
              <v-breadcrumbs-item v-else :to="item.to" :exact="item.exact" :disabled="item.disabled">
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </div>
      </div>
      <slot name="rigth" />
    </v-flex>
  </v-toolbar>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'PackageToolbar',

  props: {
    breadcrumbs: {
      type: Array,
      default: () => []
    }
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
