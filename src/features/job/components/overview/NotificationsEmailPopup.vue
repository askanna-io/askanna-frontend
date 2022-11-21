<template>
  <VDialog v-model="dialog" max-width="500px" persistent @click:outside="handleClose" @keydown.esc="handleClose">
    <template v-slot:activator="{ on, attrs }">
      <span v-on="on" v-bind="attrs" color="primary" class="pl-1 primary--hover primary--text"> Email</span>
    </template>
    <AskAnnaCard class="AskAnna-card AskAnna-card--in-dialog">
      <AskAnnaToolbar flat dense white--text color="white">
        <AskAnnaToolbarTitle class="px-0">Notifications</AskAnnaToolbarTitle>
        <AskAnnaSpacer />

        <AskAnnaButton icon @click="handleClose">
          <AskAnnaIcon>mdi-close</AskAnnaIcon>
        </AskAnnaButton>
      </AskAnnaToolbar>
      <AskAnnaCardText>
        <VTabs v-model="currentTab" left align-with-title>
          <VTabsSlider color="primary" />
          <template v-for="tab of tabs">
            <VTab v-if="tab.show" ripple :key="tab.id">
              {{ tab.name }}
            </VTab>
          </template>
        </VTabs>

        <VTabsItems v-model="currentTab">
          <template v-for="tab in tabs">
            <VTabItem :key="tab.name" v-if="tab.show" class="pt-2">
              <div>
                <h4 class="pl-2 pt-2 pb-2">Email:</h4>
                <ol>
                  <li v-for="(item, i) in notifications[tab.name].email" :key="i" height="20">
                    <VHover v-slot="{ hover }">
                      <div>
                        {{ item }}
                        <AskAnnaCopyText
                          v-if="hover"
                          :text="item"
                          :showText="false"
                          :iconColor="'grey lighten-2'"
                          :buttonType="{ text: true }"
                          :styleClasses="'px-0 white font-weight-regular text--regular body-1'"
                        />
                      </div>
                    </VHover>
                  </li>
                </ol>
              </div>
            </VTabItem>
          </template>
        </VTabsItems>
      </AskAnnaCardText>
    </AskAnnaCard>
  </VDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  notifications: {
    type: Object,
    default: () => ({
      all: { email: [] },
      error: { email: [] }
    })
  }
})

const dialog = ref(false)
const currentTab = ref('workspace-project-job-running-curl')

const isAllSet = computed(() => props.notifications['all'].email.some(item => item))
const isErrorSet = computed(() => props.notifications['error'].email.some(item => item))

const tabs = computed(() => [
  {
    id: 0,
    name: 'all',
    show: isAllSet.value
  },
  {
    id: 1,
    name: 'error',
    show: isErrorSet.value
  }
])

const handleClose = () => (dialog.value = false)
</script>
