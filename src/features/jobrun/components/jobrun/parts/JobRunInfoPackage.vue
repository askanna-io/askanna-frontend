<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        {{ text }}:<v-btn
          color="primary"
          class="px-0 text-body-1"
          text
          small
          :to="{
            name: 'workspace-project-package',
            params: { projectId: $route.params.projectId, workspaceId: $route.params.workspaceId, packageId: value }
          }"
        >
          #{{ value.slice(0, 4) }}</v-btn
        >
      </div>
    </template>
    <span>{{ value }}</span>
  </v-tooltip>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfoPackage',

  props: {
    text: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  }
})
</script>
