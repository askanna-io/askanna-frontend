<template>
  <VCheckbox v-bind="$attrs" v-on="$listeners" :value="value" @change="update" v-model="vModelValue">
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>

    <template v-for="(_, slot) in $slots" #[slot]>
      <slot :name="slot" />
    </template>
  </VCheckbox>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['value'],

  data() {
    return {
      vModelValue: this.value
    }
  },

  methods: {
    update(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

>
