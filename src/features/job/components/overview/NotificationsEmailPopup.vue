<template>
  <AskAnnaDialog
    v-model="dialog"
    persistent
    max-width="500px"
    titleClass="pb-0"
    @onClose="handleClose"
    @keydown.esc="handleClose"
    @click:outside="handleClose"
  >
    <template v-slot:activator>
      <span
        color="primary"
        @click="dialog = true"
        class="pl-1 cursor-pointer text-primary"
      >Email</span>
    </template>
    <template v-slot:title>
      Notifications
    </template>
    <template v-slot:body>
      <VTabs
        v-model="currentTab"
        left
        align-with-title
      >
        <template v-for="tab of tabs">
          <VTab
            v-if="tab.show"
            ripple
            :key="tab.id"
          >
            {{ tab.name }}
          </VTab>
        </template>
      </VTabs>

      <VWindow v-model="currentTab">
        <template v-for="tab in tabs">
          <VWindowItem
            v-if="tab.show"
            :key="tab.name"
          >
            <div>
              <h4 class="pl-2 mt-3">Email:</h4>
              <ol role="list">
                <li
                  v-for="(item, i) in notifications[tab.name].email"
                  :key="i"
                >
                  <VHover v-slot:default="{ props, isHovering }">
                    <div
                      v-bind="props"
                      class="group flex h-6 items-center"
                    >
                      {{ item }}
                      <AskAnnaCopyText
                        v-if="isHovering"
                        :text="item"
                        :showText="false"
                        :iconColor="'main'"
                        :buttonType="{ text: true }"
                      />
                    </div>
                  </VHover>
                </li>
              </ol>
            </div>
          </VWindowItem>
        </template>
      </VWindow>
    </template>
  </AskAnnaDialog>
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
