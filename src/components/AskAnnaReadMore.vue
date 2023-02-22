<template>
  <AskAnnaCard min-width="358">
    <AskAnnaCardTitle>What's AskAnna?</AskAnnaCardTitle>
    <AskAnnaCardText class="pb-2 text-body-1">
      AskAnna is the platform where you can easily collaborate on data science and machine learning projects. You can
      kickstart your next project using templates, version control, and MLOps automation tools. Also, we will make it
      easy for you to integrate with other tools. You can run everything in AskAnna using our APIs. This means that out
      of the box, you can productize your data solution, without the support of additional DevOps.
      <p class="mt-3">
        <AskAnnaButton small color="primary" href="https://docs.askanna.io" target="_blank">
          <span class="text-truncate" :class="style">Check the AskAnna documentation to get to know more</span>
        </AskAnnaButton>
      </p>
    </AskAnnaCardText>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const context = getCurrentInstance()

const style = computed(() => ({
  'is-sm': context?.proxy.$root.$vuetify.breakpoint.xs
    || context?.proxy.$root.$vuetify.breakpoint.width <= 616
}))
</script>
<style scoped>
.is-sm {
  width: 300px;
}
</style>
