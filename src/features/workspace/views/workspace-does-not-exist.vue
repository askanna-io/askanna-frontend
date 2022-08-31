<template>
  <ask-anna-page-does-not-exist pageTitle="workspace" outlined :isUserLoggedIn="isUserLoggedIn">
    <template v-slot:header v-if="isUserLoggedIn">
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </template>
  </ask-anna-page-does-not-exist>
</template>

<script setup lang="ts">
import { computed } from '@vue/composition-api'
import usePermission from '@/core/composition/usePermission'
import AskAnnaPageDoesNotExist from '@/core/components/shared/AskAnnaPageDoesNotExist.vue'

const permission = usePermission()

const breadcrumbs = computed(() => [
  {
    title: 'Workspace does not exist',
    to: '',
    disabled: true
  }
])

const isUserLoggedIn = computed(() => permission.isUserLoggedIn)
</script>
