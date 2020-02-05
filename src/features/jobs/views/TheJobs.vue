<template>
  <v-row align="center" justify="center" class="login-wrapper">
    <v-col cols="12">
      <v-data-table :headers="headers" :items="desserts" class="elevation-1">
        <template v-slot:item.fails="{ item }">
          <v-chip :color="getColor(item.fails)" dark>{{ item.fails }}</v-chip>
        </template>
        <template v-slot:item.crud>
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
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TheJobs',

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
        { text: 'Runs', value: 'runs' },
        { text: 'Fail (s)', value: 'fails' },
        { text: 'Actions', value: 'crud' },
        { text: '', value: '' },
        { text: '', value: '' }
      ],
      desserts: [
        {
          name: 'Test',
          runs: 159,
          fails: 6.0,
          crud: true
        },
        {
          name: 'Build',
          runs: 237,
          fails: 1,
          crud: true
        }
      ]
    }
  },
  methods: {
    getColor(fails) {
      if (fails > 5) return 'red'
      else if (fails >= 1) return 'orange'
      else return 'green'
    }
  }
}
</script>
