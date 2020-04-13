<template>
  <v-toolbar
    color="white"
    class="br-r5 ma-3"
    dense
    :flat="!sticked"
    on-stick="onStick"
    sticky-container
    v-sticky="true"
    sticky-offset="{top: 52, bottom: 10}"
  >
    <v-tabs v-model="currentTab" left align-with-title>
      <v-tabs-slider color="primary" />

      <v-tab
        v-for="tab of projectTools"
        ripple
        :key="tab.id"
        :to="{ name: tab.to, params: { title: `${tab.name} - ${project.name}` } }"
      >
        {{ tab.name }}
      </v-tab>

      <v-menu v-if="true" bottom right>
        <template v-slot:activator="{ on }">
          <v-btn text class="align-self-center mr-4" v-on="on">
            PROJECTS MENU
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>

        <v-list class="grey lighten-3">
          <v-list-item
            v-for="tab in projectTools"
            :key="tab.id"
            :to="{ name: tab.to, params: { title: `${tab.name} - ${project.name}` } }"
          >
            {{ tab.name }}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-tabs>

    <v-spacer />
  </v-toolbar>
</template>
<script>
export default {
  name: 'DefaultBar'
}
</script>
