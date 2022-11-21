<template>
  <AskAnnaRow align="center" justify="center">
    <AskAnnaCol cols="6" xl="6" md="4" sm="6" class="rounded pt-1">
      <AskAnnaCard>
        <AskAnnaCardTitle>Oops...something went wrong</AskAnnaCardTitle>
        <AskAnnaCardText class="text-body-1">
          The reset password link you tried to open is not valid. Maybe the token is already used, or something else
          went wrong.
          <br />
          <br />
          Please try to
          <RouterLink :to="{ name: 'forgot-password' }" class="ask-anna-link">reset your password</RouterLink>
          again, or send us an email on <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>.
        </AskAnnaCardText>
      </AskAnnaCard>
    </AskAnnaCol>
  </AskAnnaRow>
</template>
