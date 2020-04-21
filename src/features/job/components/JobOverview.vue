<template>
  <v-card class="mx-auto" flat>
    da
    <prism-editor :code="'dasd das adsdd as da'" line-numbers />

    <v-expansion-panels focusable tile>
      <v-expansion-panel>
        <v-expansion-panel-header>Description</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-textarea
            outlined
            name="input-7-4"
            label="Outlined textarea"
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          ></v-textarea
        ></v-expansion-panel-content>

        <v-expansion-panel-header>Definition</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-textarea
            outlined
            name="input-7-4"
            label="Outlined textarea"
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          ></v-textarea
        ></v-expansion-panel-content>
        <v-expansion-panel-header>Running the job</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-flex pt-2>
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
          </v-flex>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
import PrismEditor from 'vue-prism-editor'

import { onBeforeMount, defineComponent } from '@vue/composition-api'
import useJobStore from '../composition/useJobStore'

export default defineComponent({
  name: 'JobOverview',

  components: {
    PrismEditor
  },

  setup(rops, context) {
    const jobStore = useJobStore()

    onBeforeMount(() => {
      jobStore.resetStore()
      const { jobId } = context.root.$route.params

      jobStore.getJob(jobId)
    })

    return {
      ...jobStore
    }
  },

  data() {
    return {
      selection: 2
    }
  }
})
</script>
