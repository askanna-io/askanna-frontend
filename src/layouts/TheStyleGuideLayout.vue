<template>
    <VAppBar
        color="primary"
        :density="!$vuetify.display.xs ? 'compact' : 'default'"
    >
        <template v-slot:prepend>
            <VAppBarNavIcon @click="appBar = !appBar" />

            <AskAnnaLogo />
        </template>

        <VAppBarTitle>

        </VAppBarTitle>
    </VAppBar>

    <VNavigationDrawer v-model:model-value="appBar">
        <VList>
            <VListItem
                v-for="(item, i) in items"
                :key="i"
                :value="item"
                :to="item.to"
                exact
                active-color="primary"
            >
                <VListItemTitle v-text="item.title"></VListItemTitle>
            </VListItem>
        </VList>
    </VNavigationDrawer>

    <VMain class="mx-auto max-w-7xl w-full">
        <div class="p-4">
            <RouterView />
        </div>
    </VMain>
</template>

<script setup lang="ts">
import routes from '~pages'

const appBar = ref(false)
const items = routes[0].children.map(route => {

    return {
        order: route?.meta?.order || 0,
        title: route?.meta?.title || route.name,
        value: route.name,
        to: { name: route.name }
    }
}).sort((a, b) => (a.order - b.order))
</script>