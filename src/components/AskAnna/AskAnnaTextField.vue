<template>
  <v-text-field v-bind="$attrs" v-on="$listeners" :value="value" @input="update">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>
  </v-text-field>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['value'],
  methods: {
    update(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
