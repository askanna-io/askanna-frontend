<template>
  <VBreadcrumbsItem v-bind="$attrs" v-on="$listeners">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>
    <slot />
  </VBreadcrumbsItem>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
