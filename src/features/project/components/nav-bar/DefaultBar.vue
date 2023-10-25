<template>
  <div>
    <AskAnnaCardTitle class="pr-0">
      <div class="flex items-center justify-between">
        <div class="pr-3">
          <AskAnnaIcon :icon="getIcon()" />{{ project.name }}<span v-if="isEditProjectView"> - Edit mode</span>
        </div>
        <div>
          <AskAnnaButtonIconSquare
            @click="showInfo = !showInfo"
            :icon="showInfo ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          />
          <ProjectPopupMenu
            v-if="!isEditProjectView && (projectRemove || projectInfoEdit)"
            :project="project"
            :routeToRedirect="'workspace'"
          />
        </div>
      </div>
    </AskAnnaCardTitle>
    <VExpandTransition>
      <div v-show="showInfo">
        <div
          class="flex flex-col md:flex-row items-start px-4 whitespace-nowrap"
          :class="{ 'pb-2': project.description === '<p></p>' }"
        >
          <div class="md:basis-2/3 lg:basis-1/3">
            <RunInfoCopyText
              class="h-8"
              title="SUUID"
              copyTitle:="Copy SUUID"
              :value="projectStore.project.suuid"
            />
          </div>
          <div class="md:basis-2/3 lg:basis-1/3 pr-5">
            <RunInfoText
              class="h-8"
              text="Created at"
              :value="dayjs(projectStore.project.created_at).format('Do MMMM YYYY, h:mm:ss a')"
            />
          </div>
          <div class="basis-1/3">
            <RunInfoAvatar
              class="h-8"
              text="Created by"
              :value="projectStore.project.created_by"
            />
          </div>
        </div>
        <template v-if="project.description !== '<p></p>'">
          <RunInfoText
            text="Description"
            class="ml-4 h-8"
          />
          <AskAnnaDescription
            readonly
            :description="project.description"
          />
        </template>
      </div>
    </VExpandTransition>
    <AskAnnaDivider v-if="!$vuetify.display.xs && !isEditProjectView" />

    <AskAnnaSlideYTransition>
      <AskAnnaToolbar
        v-if="!isEditProjectView"
        class="my-3"
        color="white"
        density="compact"
        :class="{
          'px-0': !isMobilePlatform && (+$vuetify.display.width < 850),
          'pl-4': isMobilePlatform || (+$vuetify.display.width > 850)
        }"
      >
        <ProjectMenu
          :projectName="project.name"
          :isEditProjectView="isEditProjectView"
        />
      </AskAnnaToolbar>
    </AskAnnaSlideYTransition>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  projectVisibility: {
    type: String,
    default: 'PRIVATE'
  },
  project: {
    type: Object,
    default: function () {
      return {
        name: '',
        description: '',
        permission: {},
      }
    }
  },
})

const { dayjs } = useDayjs()
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()
const permission = useAskAnnaPermission()

const showInfo = ref(false)

const isEditProjectView = computed(() => route.name === 'workspace-project-edit')
const projectRemove = computed(() => permission.getFor(permission.labels.projectRemove))
const projectInfoEdit = computed(() => permission.getFor(permission.labels.projectInfoEdit))

const isMobilePlatform = computed(() => {
  const platform = window.navigator.userAgent.toLowerCase()
  return (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform))
})

const getIcon = () => (props.projectVisibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')
</script>
