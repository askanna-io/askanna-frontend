<template>
  <AskAnnaForbiddenPage pageTitle="workspace" outlined>
    <template v-slot:header>
      <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" exact>
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </template>
  </AskAnnaForbiddenPage>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'
import AskAnnaForbiddenPage from '@/core/components/shared/AskAnnaForbiddenPage'

export default defineComponent({
  name: 'workspace-does-not-exist',

  components: { AskAnnaForbiddenPage },

  setup() {
    const breadcrumbs = computed(() => [
      {
        title: 'Forbidden 403',
        to: '',
        disabled: true
      }
    ])

    return {
      breadcrumbs
    }
  }
})
</script>
