<template>
  <div>
    <AskAnnaCardTitle>
      <AskAnnaIcon
        class="pr-2"
        :icon="getIcon()"
      />{{ project.name }}<span v-if="isEditProjectView"> - Edit mode</span>
    </AskAnnaCardTitle>

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
        <div class="flex w-full items-center justify-between">
          <ProjectMenu
            :projectName="project.name"
            :isEditProjectView="isEditProjectView"
          />
          <ProjectPopupMenu
            v-if="!isEditProjectView && (projectRemove || projectInfoEdit)"
            :project="project"
            :routeToRedirect="'workspace'"
          />
        </div>
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

const { route } = useRouterAskAnna()
const permission = useAskAnnaPermission()

const isEditProjectView = computed(() => route.name === 'workspace-project-edit')
const projectRemove = computed(() => permission.getFor(permission.labels.projectRemove))
const projectInfoEdit = computed(() => permission.getFor(permission.labels.projectInfoEdit))

const isMobilePlatform = computed(() => {
  const platform = window.navigator.userAgent.toLowerCase()
  return (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/.test(platform))
})

const getIcon = () => (props.projectVisibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')
</script>
