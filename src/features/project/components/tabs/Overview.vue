<template>
  <v-card flat class="mx-3" outlined sticky-container>
    <v-toolbar
      :flat="!sticked"
      color="white"
      class="sticky"
      v-sticky="true"
      sticky-offset="{top: 48, bottom: 10}"
      on-stick="onStick"
    >
      <v-toolbar-title>Overview</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-toolbar>
    <v-sheet>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1"
            >Status:
            <v-chip class="ma-2" close color="green" text-color="white">
              <v-avatar left>
                <v-icon>mdi-checkbox-marked-circle</v-icon>
              </v-avatar>
              Runnnig
            </v-chip></v-list-item-title
          >
          <v-list-item-subtitle>Result: {{ project.result }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
      </v-list-item>

      <v-card-text><Code /></v-card-text>

      <v-card-actions> </v-card-actions>
    </v-sheet>
  </v-card>
</template>

<script>
import Code from './Code'
export default {
  name: 'Overview',
  components: { Code },

  data() {
    return {
      stickedVal: false,
      project: {
        name: 'Project title 1',
        id: 1,
        description:
          'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.',
        status: 'Done'
      }
    }
  },
  computed: {
    sticked: {
      get() {
        return this.stickedVal
      },
      set(val) {
        this.stickedVal = val
      }
    }
  },
  methods: {
    onStick(data) {
      this.sticked = data.sticked
    }
  }
}
</script>
