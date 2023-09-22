<template>
  <div>
    <AskAnnaCardTitle>
      <AskAnnaIcon
        class="pr-2"
        :icon="getIcon()"
      />{{ project.name }}
    </AskAnnaCardTitle>
    <AskAnnaDescription
      v-if="project.description !== '<p></p>'"
      readonly
      :description="project.description"
      :class="{ 'py-0 pl-2 ': $vuetify.display.xs }"
    />
    <AskAnnaDivider v-if="!$vuetify.display.xs" />
    <AskAnnaSlideYTransition>
      <AskAnnaToolbar
        color="white"
        density="compact"
        class="my-3 px-4"
      >
        <div class="flex w-full items-center justify-between">
          <ProjectMenu :projectName="project.name" />

          <ProjectPopupMenu
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
  project: {
    type: Object,
    default: function () {
      return {
        name: '',
        description: '',
        permission: {}
      }
    }
  }
})
const getIcon = () => (props.project.visibility === 'PUBLIC' ? 'mdi-package-variant' : 'mdi-package-variant-closed')

</script>
