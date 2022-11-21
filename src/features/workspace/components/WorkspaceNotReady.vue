<template>
  <AskAnnaCard class="mx-auto" outlined>
    <VBreadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <VBreadcrumbsItem :to="item.to" exact>
          {{ item.title }}
        </VBreadcrumbsItem>
      </template>
    </VBreadcrumbs>
    <AskAnnaDivider />
    <AskAnnaCardTitle>
      <span class="title font-weight-light">Oops...we cannot find a workspace for you</span>
    </AskAnnaCardTitle>

    <AskAnnaCardText>
      <p>
        To do something in AskAnna, your account should be a member of a workspace. If you just signed up, it can take
        some time before we have set up everything. Please try again in a minute.
        <br />
        If you were a workspace member before. You might be removed from that workspace and are currently "homeless". If
        you want to continue using AskAnna, please contact us at
        <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>. We can create a new workspace for
        you!
      </p>
    </AskAnnaCardText>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const breadcrumbs = [
  {
    title: 'Cannot find a workspace',
    to: '',
    disabled: true
  }
]
</script>
