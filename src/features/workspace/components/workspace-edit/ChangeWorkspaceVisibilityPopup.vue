<template>
  <VDialog v-model="valueModel" max-width="650px" @click:outside="handleCancel">
    <AskAnnaCard class="AskAnna-card AskAnna-card--in-dialog">
      <AskAnnaToolbar flat dense white--text color="white">
        <AskAnnaToolbarTitle class="px-0"
          >Do you want to set the visibility of this workspace to {{ visibilityInfo.name }}?</AskAnnaToolbarTitle
        >
        <AskAnnaSpacer />

        <AskAnnaButton icon @click="handleCancel">
          <AskAnnaIcon>mdi-close</AskAnnaIcon>
        </AskAnnaButton>
      </AskAnnaToolbar>
      <AskAnnaCardText>
        <span v-html="visibilityInfo.title" />
        <br />
        <br />
        <ul>
          <li v-for="(item, index) in visibilityInfo.list" :key="index">
            {{ item }}
          </li>
        </ul>
        <template v-if="visibilityInfo.bottomInfo">
          <br />
          <span v-html="visibilityInfo.bottomInfo" />
          <br />
        </template>
        <br />
      </AskAnnaCardText>
      <AskAnnaCardActions class="ml-2">
        <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="handleCancel"
          >Cancel</AskAnnaButton
        >
        <AskAnnaButton small outlined text color="error" class="mr-1 btn--hover" @click="handleConfirm"
          >Change workspace visibility
        </AskAnnaButton>
      </AskAnnaCardActions>
    </AskAnnaCard>
  </VDialog>
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

const handleCancel = () => emit('onCancel')
const handleConfirm = () => emit('onConfirm')
</script>
<style scoped>
.break {
  white-space: break-spaces;
}
.mark {
  color: rgba(0, 0, 0, 0.87);
}
</style>
