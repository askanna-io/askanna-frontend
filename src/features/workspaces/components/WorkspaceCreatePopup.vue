<template>
  <div class="text-center pl-1" v-if="true">
    <v-menu
      eager
      offset-y
      v-model="menu"
      :nudge-width="90"
      :nudge-bottom="5"
      :nudge-left="100"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" small rounded class="mr-3">
          <v-icon color="primary" left>mdi-plus</v-icon>
          Create Workspace
        </v-btn>
      </template>
      <v-card>
        <WorkspaceCreateForm showCancel @onClose="menu = false" />
      </v-card>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/composition-api'
import WorkspaceCreateForm from './WorkspaceCreateForm.vue'

const menu = ref()
</script>
