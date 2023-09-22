<template>
  <div class="flex items-center justify-center">
    <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
      <AskAnnaTitle class="text-white pb-2 text-center">Join the workspace {{ workspaceName }} on AskAnna</AskAnnaTitle>
      <VExpansionPanels
        mandatory
        :model-value="0"
      >
        <VExpansionPanel :key="0">
          <VExpansionPanelTitle>
            <AskAnnaTitle>Create a new account</AskAnnaTitle>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TheJoinCreateNewAccount />
          </VExpansionPanelText>
        </VExpansionPanel>

        <VExpansionPanel
          :key="1"
          active-class="colored-border"
        >
          <VExpansionPanelTitle>
            <AskAnnaTitle>Connect to an existing account</AskAnnaTitle>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <TheJoinConnectAccount />
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </div>
  </div>
  <div class="flex items-center justify-center pt-4 pb-4">
    <div class="w-full sm:w-9/12 md:w-6/12 xl:w-1.1/3 2xl:w-4/12">
      <AskAnnaExpansionPanels
        mandatory
        :model-value="0"
      >
        <VExpansionPanel :key="0">
          <VExpansionPanelTitle
            hide-actions
            class="h-10 pb-0  min-h-min"
          >
            <AskAnnaTitle>
              What's AskAnna?
            </AskAnnaTitle>
          </VExpansionPanelTitle>
          <VExpansionPanelText>
            <AskAnnaReadMore />
          </VExpansionPanelText>
        </VExpansionPanel>
      </AskAnnaExpansionPanels>
    </div>
  </div>
</template>

<script setup lang="ts">
const peopleStore = usePeopleStore()

const workspaceName = computed(() => peopleStore.invitation.workspace.name)
</script>