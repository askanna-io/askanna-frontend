<template>
  <div>
    <AskAnnaRow align="start" justify="center">
      <AskAnnaCol cols="8" xl="3" md="6" sm="9" lg="4" class="rounded pt-0">
        <div class="mb-2 ml-0 text-h6 white--text">Join the workspace {{ workspaceName }} on AskAnna</div>
        <VExpansionPanels class="login-expansion" v-model="panel" mandatory>
          <VExpansionPanel :key="0" active-class="colored-border">
            <VExpansionPanelHeader>
              <AskAnnaRow no-gutters>
                <AskAnnaCol cols="12" class="text-h6">Create a new account</AskAnnaCol>
              </AskAnnaRow>
            </VExpansionPanelHeader>
            <VExpansionPanelContent>
              <JoinCreateNewAccount />
            </VExpansionPanelContent>
          </VExpansionPanel>

          <VExpansionPanel :key="1" active-class="colored-border">
            <VExpansionPanelHeader>
              <AskAnnaRow no-gutters>
                <AskAnnaCol cols="12" class="text-h6">Connect to an existing account</AskAnnaCol>
              </AskAnnaRow>
            </VExpansionPanelHeader>
            <VExpansionPanelContent>
              <JoinConnectAccount />
            </VExpansionPanelContent>
          </VExpansionPanel>
        </VExpansionPanels>
      </AskAnnaCol>
    </AskAnnaRow>
    <AskAnnaRow align="center" justify="center">
      <AskAnnaCol cols="8" xl="3" md="6" sm="9" lg="4" class="rounded">
        <VExpansionPanels class="login-expansion" v-model="panel">
          <VExpandTransition>
            <AskAnnaReadMore />
          </VExpandTransition>
        </VExpansionPanels>
      </AskAnnaCol>
    </AskAnnaRow>
  </div>
</template>

<script setup lang="ts">
const panel = ref(0)
const peopleStore = usePeopleStore()

const workspaceName = computed(() => peopleStore.invitation.workspace.name)
</script>
