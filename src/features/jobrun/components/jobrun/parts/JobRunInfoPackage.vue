<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        {{ text }}:<v-btn class="px-0" text small @click="handleGotoPackage"> #{{ value.slice(0, 4) }}</v-btn>
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
  },

  setup(props, context) {
    const handleGotoPackage = () => {
      context.root.$router.push({
        name: 'workspace-project-packages-uuid-version-uuid',
        params: { ...context.root.$route.params, packageId: props.value, versionId: 1 }
      })
    }

    return {
      handleGotoPackage
    }
  }
})
</script>
