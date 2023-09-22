<template>
  <div :class="{ 'mt-4': !isUserLoggedIn }">
    <slot name="header" />

    <AskAnnaCard
      :variant="variant"
      class="text-main"
      :class="{ 'mx-4': isMainPage }"
    >
      <template v-if="isUserLoggedIn">

        <AskAnnaCardTitle>
          Oops...we cannot find this {{ pageTitle }}
        </AskAnnaCardTitle>

        <AskAnnaCardText>
          <p>
            We cannot find the {{ pageTitle }} you just tried to open. Maybe the {{ pageTitle }} is removed, or you don't
            have access to open the {{ pageTitle }} (anymore). For support you can always check with your team, or reach
            out to us on <a
              href="mailto:support@askanna.io"
              target="_blank"
            >support@askanna.io</a>.
          </p>
        </AskAnnaCardText>
      </template>
      <template v-else>
        <AskAnnaCardTitle>
          Oops...no access, or the {{ pageTitle }} does not exist
        </AskAnnaCardTitle>

        <AskAnnaCardText>
          <p>
            You cannot open the {{ pageTitle }}. This can mean you don't have access, or that the {{ pageTitle }} does not
            exist. You can try to sign in.
          </p>
        </AskAnnaCardText>
        <AskAnnaCard
          max-width="400"
          variant="flat"
          class="px-3 pb-3"
        >
          <AskAnnaCardTitle class="p-1">Sign in</AskAnnaCardTitle>
          <TheSignInForm />
        </AskAnnaCard>
      </template>
    </AskAnnaCard>
  </div>
</template>

<script setup lang="ts">
defineProps({
  pageTitle: {
    type: String,
    default: ''
  },
  isMainPage: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: () => 'flat'
  }
})

const permission = useAskAnnaPermission()
const isUserLoggedIn = computed(() => permission.isUserLoggedIn)
</script>