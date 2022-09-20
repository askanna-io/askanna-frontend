<template>
  <v-card min-width="358">
    <v-card-title>What's AskAnna?</v-card-title>
    <v-card-text class="pb-2 text-body-1">
      AskAnna is the platform where you can easily collaborate on data science and machine learning projects. You can
      kickstart your next project using templates, version control, and MLOps automation tools. Also, we will make it
      easy for you to integrate with other tools. You can run everything in AskAnna using our APIs. This means that out
      of the box, you can productize your data solution, without the support of additional DevOps.
      <p class="mt-3">
        <v-btn small color="primary" href="https://docs.askanna.io" target="_blank">
          <span class="text-truncate" :class="style">Check the AskAnna documentation to get to know more</span></v-btn
        >
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const context = getCurrentInstance()

const style = computed(() => ({ 'is-sm': context?.proxy.$root.$vuetify.breakpoint.xs }))
</script>
<style scoped>
.is-sm {
  width: 300px;
}
</style>
