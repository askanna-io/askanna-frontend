<template>
  <v-card class="mx-auto" outlined>
    <v-breadcrumbs :items="breadcrumbs">
      <template v-slot:item="{ item }">
        <v-breadcrumbs-item :to="item.to" exact>
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-divider />
    <v-card-title>
      <span class="title font-weight-light">Oops...we cannot find a workspace for you</span>
    </v-card-title>

    <v-card-text>
      <p>
        To do something in AskAnna, your account should be a member of a workspace. If you just signed up, it can take
        some time before we have set up everything. Please try again in a minute.
        <br />
        If you were a workspace member before. You might be removed from that workspace and are currently "homeless". If
        you want to continue using AskAnna, please contact us at
        <a href="mailto:support@askanna.io" target="_blank">support@askanna.io</a>. We can create a new workspace for
        you!
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'WorkspaceNotReady',

  setup() {
    const breadcrumbs = computed(() => [
      {
        title: 'Cannot find a workspace',
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
