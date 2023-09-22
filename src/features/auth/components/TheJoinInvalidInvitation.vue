<template>
  <div class="flex items-center justify-center">
    <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
      <AskAnnaCard>
        <AskAnnaCardTitle>
          <AskAnnaTitle>Oops...something went wrong</AskAnnaTitle>
        </AskAnnaCardTitle>
        <AskAnnaCardText>
          The invitation you tried to open is not valid. Maybe the invitation is already accepted, or something else
          went wrong. An invitation is valid for 7 days. A workspace member can easily resend the invitation to you.
          <br />
          <br />
          Please check with the person who send you the invite, or send us an email on
          <a
            href="mailto:support@askanna.io"
            target="_blank"
          >support@askanna.io</a>.
        </AskAnnaCardText>
      </AskAnnaCard>
    </div>
  </div>
</template>