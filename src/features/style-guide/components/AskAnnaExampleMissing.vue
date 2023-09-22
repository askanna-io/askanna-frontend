<template>
    <app-markdown
        class="v-example-missing text-center"
        v-text="'missing' + file"
    />
</template>

<script setup>

defineProps({
    file: {
        type: String,
        required: true,
    },
})

</script>

<style lang="sass">
  .v-example-missing > p
    margin: 0
</style>