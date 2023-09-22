<template>
  <AskAnnaDialog
    v-model="valueModel"
    @onClose="close"
  >
    <template v-slot:title>
      Do you want to set the visibility of this workspace to {{ visibilityInfo.name }}?
    </template>
    <template v-slot:body>
      <span v-html="visibilityInfo.title" />
      <ul>
        <li
          v-for="(item, index) in visibilityInfo.list"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
      <template v-if="visibilityInfo.bottomInfo">
        <p v-html="visibilityInfo.bottomInfo"></p>
      </template>
    </template>
    <template v-slot:actions>
      <AskAnnaButton @click="close">Cancel</AskAnnaButton>
      <AskAnnaButton
        color="error"
        @click="handleConfirm"
      >Change workspace visibility
      </AskAnnaButton>
    </template>
  </AskAnnaDialog>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    default: () => 'public'
  },
  workspaceName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onCancel', 'onConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.workspaceName, 17))

const visibilityHandler = {
  PUBLIC: {
    name: 'public',
    title: `You are about to set the visibility of the workspace <b>${name.value}</b> to public. When you change the visibility to public, then:`,
    list: [
      'people who are not signed in can view and discover this workspace name and description',
      'people can explore and view the public projects of this workspace'
    ],
    bottomInfo: `Important: it can be that some of the projects already have the visibility status set to public. If you allow public visibility of the workspace <b>${name.value}</b> then these projects will directly become publicly visible.`
  },

  PRIVATE: {
    name: 'private',

    title: `You are about to set the visibility of the workspace <b>${name.value}</b> to private. When you change the visibility to private, then:`,
    list: [
      'people who are not signed in cannot view and discover this workspace name and description',
      'people cannot explore and view the public projects of this workspace'
    ]
  }
}

const visibilityInfo = computed(() => visibilityHandler[props.visibility])

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onCancel')
})

const close = () => emit('onCancel')
const handleConfirm = () => emit('onConfirm')
</script>