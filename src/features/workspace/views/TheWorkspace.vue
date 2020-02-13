<template>
  <div>
    <v-data-iterator :items="projects" hide-default-footer>
      <template v-slot:header>
        <v-toolbar color="secondary" flat dense class="br-r5">
          <v-btn small rounded color="primary" class="mr-3">
            <v-icon left>mdi-plus</v-icon>
            Create Project
          </v-btn>
          <v-select
            v-model="workspace"
            :width="'30px'"
            color="primary"
            :items="items"
            hide-details
            flat
            label="Solo field"
            dense
            solo
          />
          <v-spacer></v-spacer>

          <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" color="white">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-subtitle>Workspace settings</v-card-subtitle>
              <v-card-text>
                ...
              </v-card-text>
              <v-card-subtitle>Project view</v-card-subtitle>
              <v-card-text>
                <v-btn-toggle v-model="projectView" mandatory>
                  <v-btn>
                    <v-icon>mdi-card-bulleted-outline</v-icon>
                  </v-btn>

                  <v-btn>
                    <v-icon>mdi-format-align-justify</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-toolbar>
      </template>
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
            <v-card class="mx-auto">
              <v-card-title>
                <v-icon large left>
                  mdi-semantic-web
                </v-icon>
                <span class="title font-weight-light">Project title 1</span>
              </v-card-title>

              <v-card-text class="font-weight-bold">
                "Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type
                invalid as well."
              </v-card-text>

              <v-card-actions>
                <v-alert text dense type="success" class="d-flex">
                  Status: <strong>success</strong> Last run on <strong>Oct 23, 2019</strong>
                </v-alert>
              </v-card-actions>
              <v-card-actions>
                <v-list-item>
                  <v-list-item-content color="grey darken-3">
                    <v-avatar>
                      <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                    </v-avatar>
                  </v-list-item-content>
                  <v-list-item-content color="grey darken-3">
                    <v-avatar>
                      <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                    </v-avatar>
                  </v-list-item-content>
                  <v-list-item-content color="grey darken-3">
                    <v-avatar>
                      <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                    </v-avatar>
                  </v-list-item-content>
                  <v-list-item-content color="grey darken-3">
                    <v-avatar>
                      <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                    </v-avatar>
                  </v-list-item-content>
                  <v-list-item-content color="grey darken-3">
                    <v-avatar>
                      <img src="https://randomuser.me/api/portraits/men/81.jpg" />
                    </v-avatar>
                  </v-list-item-content>
                </v-list-item>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
    <ask-anna-divider text="Latest Activity" />
    <ask-anna-time-lines text="Latest Activity" />
  </div>
</template>

<script>
export default {
  name: 'TheWorkspace',

  data() {
    return {
      menu: false,
      projectView: true,
      workspace: 'Workspace 2',
      selection: 2,
      items: ['Workspace 1', 'Workspace 2', 'Workspace 3'],
      projects: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        },
        {
          name: 'Frozen Yogurt2',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: '14%',
          iron: '1%'
        }
      ]
    }
  },

  methods: {}
}
</script>
<style scoped>
.br-r5 {
  border-radius: 5px;
}
</style>
