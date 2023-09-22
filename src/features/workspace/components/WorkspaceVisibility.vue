<template>
  <div class="w-full">
    <AskAnnaTitle class="pt-4 pb-1">Workspace settings</AskAnnaTitle>

    <AskAnnaRadioGroup
      hide-details
      :model-value="visibility"
      @update:modelValue="handleChangeVisibility($event)"
    >
      <AskAnnaCardSubTitle class="text-lg px-1">Visibility</AskAnnaCardSubTitle>
      <AskAnnaRadio
        value="PRIVATE"
        label="Private"
        class="font-medium"
      />
      <div class="pb-2 pl-7 -mt-1">
        Projects in this workspace can only be viewed by workspace or project members.
      </div>
      <AskAnnaRadio
        label="Public"
        value="PUBLIC"
        class="font-medium"
      />
      <div class="pl-7 -mt-1">
        Allow public projects that can be viewed by people without any authentication. Also the workspace name
        and description becomes publicly available.
      </div>
    </AskAnnaRadioGroup>
  </div>
</template>
<script setup lang="ts">
defineProps({
  visibility: {
    type: String,
    default: () => 'public'
  }
})

const emit = defineEmits(['onChangeVisibility'])

const handleChangeVisibility = (value: string) => {
  emit('onChangeVisibility', value)
}

</script>