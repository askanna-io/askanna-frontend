<template>
  <v-container class="ma-0" fluid>
    <v-card-title>Definition:</v-card-title>
    <v-row>
      <v-col cols="2" sm="6"> <span>File: </span>File.name </v-col>
      <v-col cols="2" sm="6"> <span>Code: </span>Package.v1 </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" sm="6"> <span>Function: </span>{{ job.function }}</v-col>
      <v-col cols="6" sm="6"> <span>Environment: </span>{{ job.env_variables }}</v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobDefinition',

  props: {
    job: {
      type: Object,
      default: function () {
        return {
          env_variables: ''
        }
      }
    }
  },

  setup(rops, context) {
    return {}
  }
})
</script>