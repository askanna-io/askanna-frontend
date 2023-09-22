<template>
    <div class="flex gap-3 max-w-sm mx-auto flex-col">
        <AskAnnaTextField
            required
            label="Email"
            :model-value="'andrii@askanna'"
            error-messages="email is not valid"
        />

    </div>
</template>