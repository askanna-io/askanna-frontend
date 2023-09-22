<template>
  <div class="w-full">
    <AskAnnaTitle class="pt-4 pb-1">Project settings</AskAnnaTitle>
    <AskAnnaRadioGroup
      hide-details
      :model-value="visibility"
      @update:modelValue="handleChangeVisibility($event)"
    >
      <AskAnnaCardSubTitle class="text-lg px-1">Visibility</AskAnnaCardSubTitle>
      <AskAnnaRadio
        label="Private"
        value="PRIVATE"
        class="font-medium"
      />
      <div class="pb-2 pl-7 -mt-1">
        Only workspace and project members can see this project.
      </div>
      <AskAnnaRadio
        label="Public"
        value="PUBLIC"
        class="font-medium"
        :disabled="workspaceProjectVisibility === 'PRIVATE'"
      >
        <template v-slot:label>
          <div :class="{
            'text-secondary': visibility === 'PRIVATE' && workspaceProjectVisibility === 'PRIVATE',
            'text-error': visibility === 'PUBLIC' && workspaceProjectVisibility === 'PRIVATE'
          }">
            Public
          </div>
        </template>
      </AskAnnaRadio>
      <div
        v-if="workspaceProjectVisibility === 'PUBLIC'"
        class="pl-7 -mt-1"
      >
        Anyone on the internet can view this project.
      </div>
      <template v-else>
        <div
          v-if="visibility === 'PRIVATE' && workspaceProjectVisibility === 'PRIVATE'"
          class="pl-7 -mt-1 text-secondary"
        >
          You cannot select this option, because your workspace does not allow public sharing of projects. If
          you are a workspace admin, you can change the project visibility in the
          <RouterLink
            :to="{ name: 'workspace-edit', params: { workspaceId: route.params.workspaceId } }"
            class="askanna-link"
          >workspace setting</RouterLink>.
        </div>
        <div
          v-else
          class="pl-7 -mt-1 text-error"
        >
          Your workspace does not allow public sharing of projects. Your workspace setting will overrule the
          project visibility set to public. If you are a workspace admin, you can change the project visibility
          in the
          <RouterLink
            :to="{ name: 'workspace-edit', params: { workspaceId: route.params.workspaceId } }"
            class="askanna-link"
          >workspace setting</RouterLink>.
        </div>
      </template>
    </AskAnnaRadioGroup>
  </div>
</template>
<script setup lang="ts">
defineProps({
  visibility: {
    type: String,
    default: () => 'PUBLIC'
  },
  workspaceProjectVisibility: {
    type: String,
    default: () => 'PUBLIC'
  },
})

const emit = defineEmits(['onChangeVisibility'])

const { route } = useRouterAskAnna()

const handleChangeVisibility = (value: string) => {
  emit('onChangeVisibility', value)
}

</script>