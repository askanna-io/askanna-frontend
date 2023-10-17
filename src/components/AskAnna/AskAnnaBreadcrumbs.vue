<template>
    <nav
        class="flex "
        :class="[contentClass]"
        aria-label="Breadcrumb"
    >
        <ul
            role="list"
            :class="[listClass]"
            class="overflow-x-auto flex items-center list-none scroll-smooth"
        >
            <li
                v-for="(item, index) in items"
                :key="item.title"
            >
                <div class="inline-flex items-center">
                    <RouterLink
                        custom
                        :to="item.to"
                        v-slot="{ href, navigate, isExactActive }"
                    >
                        <a
                            v-if="!isExactActive"
                            :href="href"
                            @click="navigate"
                            :title="item.title"
                            :class="{ 'text-primary': !item.disabled, 'text-main': item.disabled }"
                            class="inline-flex whitespace-nowrap no-underline text-sm font-normal hover:underline"
                        >
                            {{ slicedText(item.title, 47) }}
                            <AskAnnaTooltip v-if="item.showTooltip">
                                <span v-html="item.tooltip" />
                            </AskAnnaTooltip>
                        </a>
                        <span
                            v-else
                            class="inline-flex whitespace-nowrap no-underline text-sm font-normal text-main cursor-default"
                        >
                            {{ slicedText(item.title, 47) }}
                        </span>
                    </RouterLink>

                    <svg
                        v-if="index !== items.length - 1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        class="h-4 w-4 flex-shrink-0"
                    >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                </div>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
    to: string
    title: string
    tooltip?: string
    disabled: boolean
    showTooltip?: boolean
}

interface Props {
    listClass?: string
    contentClass?: string
    items: BreadcrumbItem[]
}

withDefaults(defineProps<Props>(), {
    items: () => [],
    listClass: 'pt-2 sm:pt-0',
    contentClass: 'pl-4 sm:pl-6',
})

const slicedText = useSlicedText()

</script>