<template>
  <v-card class="mx-auto" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">{{ project.name }}</div>
        <v-list-item-title class="headline mb-1">Status: {{ project.status }}</v-list-item-title>
        <v-list-item-subtitle>Result: {{ project.esult }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
    </v-list-item>

    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
import useProject from '../composition/useProject'
import { onBeforeMount } from '@vue/composition-api'

export default {
  name: 'TheJob',

  setup(rops, context) {
    const project = useProject()

    onBeforeMount(() => {
      const { id } = context.root.$route.params

      project.getProject(id)
    })

    return {
      ...project
    }
  },

  data() {
    return {
      selection: 2
    }
  }
}
</script>
