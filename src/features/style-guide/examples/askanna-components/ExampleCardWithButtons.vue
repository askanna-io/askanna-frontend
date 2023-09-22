<template>
    <AskAnnaCard>
        <AskAnnaCardTitle>
            <div class="flex items-center justify-between">
                AskAnna warning
                <AskAnnaButton
                    variant="text"
                    class="ml-4"
                    icon="mdi-close"
                />
            </div>
        </AskAnnaCardTitle>

        <AskAnnaCardText class="pt-1">
            This account is already a member of the <b>Name</b> workspace.
            <br />
            Do you want to login and open the workspace?"
        </AskAnnaCardText>

        <AskAnnaCardActions class="mx-4">
            <AskAnnaButton
                class="mr-4"
                color="primary"
                variant="elevated"
            >
                YES
            </AskAnnaButton>
            <AskAnnaButton class="mr-4">
                NO, I WANT TO USE ANOTHER ACCOUNT
            </AskAnnaButton>
        </AskAnnaCardActions>
    </AskAnnaCard>
</template>
