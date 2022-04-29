<template>
  <v-menu
    v-if="menuItems.length"
    bottom
    offset-y
    v-model="menu"
    class="workspace-menu"
    data-test="workspace-menu"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" @click.stop.prevent="on.click" small class="">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <v-list>
      <template v-for="(item, index) in menuItems">
        <v-list-item v-if="item.isVisible" @click="handleMenuClick(item)" :key="index">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>
<script setup lang="ts">
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, getCurrentInstance } from '@vue/composition-api'

const router = useRouterAskAnna()
const context = getCurrentInstance()

const menu = ref(false)

const menuItems = computed(() =>
  [
    {
      title: 'Create workspace',
      to: 'workspace-new',
      isVisible: context.root.proxy.$vuetify.breakpoint.xsOnly
    }
  ].filter(el => el.isVisible)
)

const handleMenuClick = item => {
  menu.value = false

  router.push({
    name: item.to
  })
}
</script>
