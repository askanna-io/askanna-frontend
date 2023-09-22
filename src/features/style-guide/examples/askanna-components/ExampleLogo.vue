<template>
    <AskAnnaToolbar
        color="primary"
        class="z-20 px-2 rounded"
        :density="!$vuetify.display.xs ? 'compact' : 'default'"
    >

        <template v-slot:prepend>
            <AskAnnaLogo />
        </template>
    </AskAnnaToolbar>



    <h3>Big version:</h3>
    <div class="overflow-hidden bg-[url('/assets/bg/askanna-bg-01.svg')] bg-cover h-100 flex flex-col">
        <div class="mx-auto ">
            <div class="flex items-center justify-center px-6 sm:px-0">
                <div class="w-full ">
                    <AskAnnaLogoBig />
                </div>
            </div>
        </div>
    </div>
</template>