<template>
  <div>
    <v-row align="start" justify="center">
      <v-col cols="8" xl="3" md="6" sm="9" lg="4" class="rounded pt-0">
        <div class="mb-2 ml-0 text-h6 white--text">Join the workspace {{ workspaceName }} on AskAnna</div>
        <v-expansion-panels class="login-expansion" v-model="panel" mandatory>
          <v-expansion-panel :key="0" active-class="colored-border">
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-col cols="12" class="text-h6">Create a new account</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <JoinCreateNewAccount />
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel :key="1" active-class="colored-border">
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-col cols="12" class="text-h6">Connect to an existing account</v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <JoinConnectAccount />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="8" xl="3" md="6" sm="9" lg="4" class="rounded">
        <v-expansion-panels class="login-expansion" v-model="panel">
          <v-expand-transition>
            <AskAnnaReadMore />
          </v-expand-transition>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const panel = ref(0)
const peopleStore = usePeopleStore()

const workspaceName = computed(() => peopleStore.invitation.workspace.name)
</script>
<style scoped>
.login-expansion .v-expansion-panel {
}
.colored-border {
  border: 1px solid;
}
.no-bg {
  background: none;
}
</style>
