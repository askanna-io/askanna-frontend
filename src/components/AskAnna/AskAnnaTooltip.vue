<template>
  <v-tooltip v-bind="$attrs" v-on="$listeners">
    <template v-for="scopedSlotName in Object.keys($scopedSlots)" #[scopedSlotName]="slotData">
      <slot :name="scopedSlotName" v-bind="slotData" />
    </template>

    <template v-for="slotName in Object.keys($slots)" #[slotName]>
      <slot :name="slotName" />
    </template>
  </v-tooltip>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
