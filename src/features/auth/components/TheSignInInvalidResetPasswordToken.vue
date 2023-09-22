<template>
  <div class="flex items-center justify-center">
    <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
      <AskAnnaCard>
        <AskAnnaCardTitle>Oops...something went wrong</AskAnnaCardTitle>
        <AskAnnaCardText>
          The reset password link you tried to open is not valid. Maybe the token is already used, or something else
          went wrong.
          <br />
          <br />
          Please try to
          <RouterLink
            :to="{ name: 'forgot-password' }"
            class="text-primary no-underline"
          >reset your password</RouterLink>
          again, or send us an email on <a
            href="mailto:support@askanna.io"
            target="_blank"
          >support@askanna.io</a>.
        </AskAnnaCardText>
      </AskAnnaCard>
    </div>
  </div>
</template>