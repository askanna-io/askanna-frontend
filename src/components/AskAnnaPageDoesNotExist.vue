<template>
  <AskAnnaCard class="mx-auto" :outlined="outlined" flat>
    <slot name="header" />
    <template v-if="isUserLoggedIn">
      <AskAnnaDivider />

      <AskAnnaCardTitle>
        <span class="title font-weight-light">Oops...we cannot find this {{ pageTitle }}</span>
      </AskAnnaCardTitle>

      <AskAnnaCardText>
        <p>
          We cannot find the {{ pageTitle }} you just tried to open. Maybe the {{ pageTitle }} is removed, or you don't
          have access to open the {{ pageTitle }} (anymore). For support you can always check with your team, or reach
          out to us on <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
        </p>
      </AskAnnaCardText>
    </template>
    <template v-else>
      <AskAnnaCardTitle>
        <span class="title font-weight-light">Oops...no access, or the {{ pageTitle }} does not exist</span>
      </AskAnnaCardTitle>

      <AskAnnaCardText>
        <p>
          You cannot open the {{ pageTitle }}. This can mean you don't have access, or that the {{ pageTitle }} does not
          exist. You can try to sign in.
        </p>
      </AskAnnaCardText>
      <AskAnnaCard flat max-width="400" class="px-3 pb-3">
        <AskAnnaCardTitle class="pa-1">Sign in</AskAnnaCardTitle>
        <SignIn />
      </AskAnnaCard>
    </template>
  </AskAnnaCard>
</template>

<script setup lang="ts">
defineProps({
  pageTitle: {
    type: String,
    default: ''
  },
  outlined: {
    type: Boolean,
    default: false
  }
})

const permission = usePermission()
const isUserLoggedIn = computed(() => permission.isUserLoggedIn)
</script>
