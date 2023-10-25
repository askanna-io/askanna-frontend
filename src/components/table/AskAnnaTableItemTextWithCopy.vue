<template>
    <div
        class="flex items-center gap-1"
        :class="{ 'pr-6': !copyBtn }"
    >
        <span class="whitespace-pre">{{ prefix }}{{ slicedText(value, maxLength, suffix) }}</span>

        <AskAnnaTooltip v-if="value.length !== slicedText(value, maxLength).length">
            {{ value }}
        </AskAnnaTooltip>

        <AskAnnaButtonIconSquare
            v-if="!$vuetify.display.xs && copyBtn"
            icon="mdi-content-copy"
            iconSize="x-small"
            @click.prevent="handleCopy"
            class="invisible group-hover:visible group-focus:visible z-50"
        >
            <AskAnnaTooltip location="end">
                {{ copyTitle }}
            </AskAnnaTooltip>
        </AskAnnaButtonIconSquare>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    suffix: {
        type: String,
        default: '...'
    },
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
    maxLength: {
        type: Number,
        default: 0
    },
    copyBtn: {
        type: Boolean,
        default: true
    }
})

const copy = useCopy()
const slicedText = useSlicedText()

const handleCopy = () => copy.handleCopyText(props.value)
</script>