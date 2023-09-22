<template>
    <td class="p-0 bg-transparent h-10">
        <RouterLink
            v-if="to"
            :to="to || {}"
            class="no-underline group text-main flex items-center h-full"
            :class="[linkClass ? linkClass : 'pl-4']"
        >
            <slot></slot>
        </RouterLink>
        <div
            v-else
            class="group text-main flex items-center h-full px-4"
        >
            <slot></slot>
        </div>
    </td>
</template>
<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'

interface Props {
    to?: RouteLocationRaw | undefined
    linkClass?: String | undefined
}

withDefaults(defineProps<Props>(), {
})
</script>