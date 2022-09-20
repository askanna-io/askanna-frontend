<template>
  <AskAnnaPageDoesNotExist pageTitle="workspace" outlined>
    <template v-slot:header v-if="isUserLoggedIn">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </template>
  </AskAnnaPageDoesNotExist>
</template>

<script setup lang="ts">
const { isUserLoggedIn } = usePermission()

const breadcrumbs = computed(() => [
  {
    title: 'Workspace does not exist',
    to: '',
    disabled: true
  }
])
</script>
