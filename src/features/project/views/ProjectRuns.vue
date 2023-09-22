<template>
    <div class="mx-auto">
        <AskAnnaLoadingProgress :loading="runsStore.runsLoading">
            <Runs
                :suuid="suuid"
                isProjectRuns
                suuidKey='project_suuid'
                :itemsPerPage="itemsPerPage"
                :tableClass="'job-sub-table'"
            />
        </AskAnnaLoadingProgress>
    </div>
</template>

<script setup lang="ts">
const runsStore = useRunsStore()
const { route } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const itemsPerPage = computed(() => +queryParams.value?.page_size || 25)

const { projectId: suuid } = route.params

runsStore.$reset()
</script>
