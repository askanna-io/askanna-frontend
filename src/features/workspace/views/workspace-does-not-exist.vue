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

<script>
import usePermission from '@/core/composition/usePermission'
import { computed, defineComponent } from '@vue/composition-api'
import AskAnnaPageDoesNotExist from '@/core/components/shared/AskAnnaPageDoesNotExist'

export default defineComponent({
  name: 'workspace-does-not-exist',

  components: { AskAnnaPageDoesNotExist },

  setup() {
    const permission = usePermission()

    const breadcrumbs = computed(() => [
      {
        title: 'Workspace does not exist',
        to: '',
        disabled: true
      }
    ])

    return {
      breadcrumbs,
      isUserLoggedIn: permission.isUserLoggedIn
    }
  }
})
</script>
