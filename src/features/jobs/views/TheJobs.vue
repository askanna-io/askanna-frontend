<template>
  <v-row align="center" justify="center" class="login-wrapper">
    <v-col cols="12">
      <v-data-table :headers="headers" :items="list" class="elevation-1" @click:row="gotoJob">
        <template v-slot:item.uuid>
          <v-chip :color="getColor(Math.round(Math.random() * 10))" dark>{{ Math.round(Math.random() * 10) }}</v-chip>
        </template>
        <template v-slot:item.status>
          <v-chip-group outlinedv-model="selection" active-class="deep-purple--text text--accent-4" mandatory>
            <v-chip outlined color="success">
              <v-avatar left><v-icon>mdi-play</v-icon></v-avatar
              >start</v-chip
            >
            <v-chip outlined color="error"
              ><v-avatar left><v-icon>mdi-stop</v-icon></v-avatar
              >ssrop</v-chip
            >
            <v-chip outlined color="warning"
              ><v-avatar left><v-icon>mdi-pause</v-icon></v-avatar
              >spause</v-chip
            >
            <v-chip
              ><v-avatar left><v-icon>mdi-reload</v-icon></v-avatar
              >reset</v-chip
            >
          </v-chip-group>
        </template>
        <template v-slot:item.id="{ item }">
          <v-btn :to="`job/${item.id}`" text>...</v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import useJobs from '../composition/useJobs'

export default {
  name: 'TheJobs',

  setup() {
    const jobs = useJobs()

    return {
      ...jobs
    }
  },

  data() {
    return {
      selection: 2,

      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Runs', value: 'uuid' },

        { text: 'Actions', value: 'status' },
        { text: '', value: 'id' }
      ]
    }
  },

  updated() {
    console.log(this.list)
  },

  methods: {
    getColor(fails) {
      if (fails > 5) return 'red'
      else if (fails >= 1) return 'orange'
      else return 'green'
    },
    gotoJob(item) {
      console.log(item)
    }
  }
}
</script>
