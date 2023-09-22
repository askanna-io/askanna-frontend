<template>
  <AskAnnaCard
    class="mx-auto"
    :variant="variant"
    flat
  >
    <slot name="header" />
    <AskAnnaDivider />
    <AskAnnaCardTitle>
      <span class="text-h6 font-weight-light">Oops...you cannot see this {{ pageTitle }}</span>
    </AskAnnaCardTitle>

    <AskAnnaCardText>
      <p>
        You cannot see the {{ pageTitle }} you just tried to open. Maybe the {{ pageTitle }} is removed, or you don't
        have access to open the {{ pageTitle }} (anymore). For support you can always check with your team, or reach out
        to us on <a
          href="mailto:support@askanna.io"
          target="_blank"
        >support@askanna.io</a>.
      </p>
    </AskAnnaCardText>
  </AskAnnaCard>
</template>

<script setup lang="ts">
defineProps({
  pageTitle: {
    type: String,
    default: ''
  },
  //@TODO refac previous boolea to STRING
  variant: {
    type: String,
    default: 'outlined'
  }
})
</script>
