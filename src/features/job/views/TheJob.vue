<template>
  <v-card class="mx-auto" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">{{ job.name }}</div>
        <v-list-item-title class="headline mb-1">Status: {{ job.status }}</v-list-item-title>
        <v-list-item-subtitle>Result: {{ result }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
    </v-list-item>

    <v-card-actions>
      <v-chip-group outlinedv-model="selection" active-class="deep-purple--text text--accent-4" mandatory>
        <v-chip outlined color="success" @click="startJob(job.uuid)">
          <v-avatar left><v-icon>mdi-play</v-icon></v-avatar
          >start</v-chip
        >
        <v-chip outlined color="error" @click="stopJob(job.uuid)"
          ><v-avatar left><v-icon>mdi-stop</v-icon></v-avatar
          >stop</v-chip
        >
        <v-chip outlined color="warning" @click="killJob(job.uuid)"
          ><v-avatar left><v-icon>mdi-pause</v-icon></v-avatar
          >kill</v-chip
        >
        <v-chip @click="resetJob(job.uuid)"
          ><v-avatar left><v-icon>mdi-reload</v-icon></v-avatar
          >reset</v-chip
        >

        <v-chip @click="resultJob(job.uuid)"
          ><v-avatar left><v-icon>mdi-information</v-icon></v-avatar
          >result</v-chip
        >
      </v-chip-group>
    </v-card-actions>
  </v-card>
</template>

<script>
import useJob from '../composition/useJob'
import { onBeforeMount, createComponent } from '@vue/composition-api'

export default createComponent({
  name: 'TheJob',

  setup(rops, context) {
    const job = useJob()

    onBeforeMount(() => {
      job.resetStore()
      const { id } = context.root.$route.params

      job.getJob(id)
    })

    return {
      ...job
    }
  },

  data() {
    return {
      selection: 2
    }
  }
})
</script>
