<template>
  <VDialog
    v-bind="$attrs"
    v-model="valueModel"
    :max-width="maxWidth"
    @click:outside="close"
  >
    <template v-slot:activator>
      <slot name="activator" />
    </template>
    <AskAnnaCard :class="{ 'pt-2': $vuetify.display.xs }">
      <AskAnnaCardTitle
        class="pl-6"
        :class="titleClass"
      >
        <div class="flex items-center justify-between">
          <slot name="title" />
          <AskAnnaSpacer />
          <AskAnnaButtonIconSquare
            class="ml-4 hover:text-primary cursor"
            icon="mdi-close"
            @click="close"
          />
        </div>
      </AskAnnaCardTitle>
      <AskAnnaCardText class="prose pt-0 max-w-full pr-7">
        <slot name="body"></slot>
      </AskAnnaCardText>
      <AskAnnaCardActions
        v-if="slots.actions"
        class="pl-6"
        :class="{ 'pl-3': $vuetify.display.xs }"
      >
        <slot name="actions"></slot>
      </AskAnnaCardActions>
    </AskAnnaCard>
  </VDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: String,
    default: () => '650px'
  },
  titleClass: {
    type: String,
    default: () => ''
  },
})

const slots = useSlots()
const emit = defineEmits(['onClose', 'update:modelValue'])

const valueModel = computed({
  get: () => props.modelValue,
  set: () => emit('update:modelValue')
})

const close = () => emit('onClose')
</script>