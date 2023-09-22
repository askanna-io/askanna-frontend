<template>
    <template v-if="!$vuetify.display.xs">
        <AskAnnaTooltip>
            <template v-slot:activator="{
                props
            }">
                <div>
                    <AskAnnaButton
                        v-bind="props"
                        class="px-1"
                        variant="text"
                    >
                        #{{ slicedValue }}
                    </AskAnnaButton>
                </div>
            </template>
            {{ value }}
        </AskAnnaTooltip>
        <AskAnnaButtonIcon
            variant="text"
            size="x-small"
            class="invisible group-hover:visible group-focus:visible z-50"
            @click.prevent="handleCopy(value)"
        >
            <AskAnnaIcon icon="mdi-content-copy" />
            <AskAnnaTooltip location="end">
                Copy
            </AskAnnaTooltip>
        </AskAnnaButtonIcon>

        <AskAnnaTooltip
            v-if="!$vuetify.display.xs"
            top
            :content-class="`opacity-1 ${!showTooltip ? ' hidden' : ''}`"
        >
            <template v-slot:activator="{ on, value: show }">
                <div
                    v-on="on"
                    :class="{ 'pr-5': !show }"
                    class="flex items-center justify-start"
                >
                    <AskAnnaButton
                        variant="plain"
                        min-width="10"
                        class="px-0 text-none justify-start tracking-normal opacity-1 font-weight-regular"
                    >{{ prefix }}{{ slicedValue }}</AskAnnaButton>
                    <AskAnnaTooltip
                        right
                        content-class="opacity-1"
                    >
                        <template v-slot:activator="{ on }">
                            <AskAnnaButton
                                icon
                                text
                                x-small
                                v-on="on"
                                v-show="show"
                                @click.prevent="handleCopy(value)"
                            >
                                <AskAnnaIcon>mdi-content-copy</AskAnnaIcon>
                            </AskAnnaButton>
                        </template>
                        <span>{{ copyTitle }}</span>
                    </AskAnnaTooltip>
                </div>
            </template>
            <span>{{ value }}</span>
        </AskAnnaTooltip>
    </template>
    <template v-else>{{ prefix }}{{ slicedValue }}</template>
</template>

<script setup lang="ts">
const props = defineProps({
    copyTitle: {
        type: String,
        default: 'Copy'
    },
    value: {
        type: String,
        default: ''
    },
    prefix: {
        type: String,
        default: ''
    },
    sliceBy: {
        type: Number,
        default: 0
    },
    rightPadding: {
        type: Boolean,
        default: false
    },
    showTooltip: {
        type: Boolean,
        default: false
    }
})

const copy = useCopy()

const slicedValue = computed(() => props.sliceBy ? props.value?.slice(0, props.sliceBy) : props.value)
const handleCopy = (value: string) => copy.handleCopyText(value)
</script>