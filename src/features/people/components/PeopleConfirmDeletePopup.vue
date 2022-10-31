<template>
  <v-dialog v-model="valueModel" max-width="650px">
    <AskAnnaCard class="AskAnna-card AskAnna-card--in-dialog">
      <AskAnnaToolbar
        flat
        white--text
        color="white"
        :dense="!$vuetify.breakpoint.xsOnly"
        :height="calcHeight($vuetify.breakpoint.xsOnly)"
      >
        <AskAnnaToolbarTitle v-if="!$vuetify.breakpoint.xsOnly" class="px-0 toolbar-title">
          <div class="grid-container">
            <div class="pre">Do you want to remove&nbsp;</div>
            <div class="long primary--text">{{ peopleName }}</div>
            <div class="mark pre">&nbsp;?</div>
          </div>
        </AskAnnaToolbarTitle>
        <div v-else class="text-body-1 font-weight-bold">
          Do you want to remove <span class="primary--text">{{ peopleName }}</span
          >?
        </div>
        <AskAnnaSpacer />
        <AskAnnaButton icon @click="closeDelete">
          <AskAnnaIcon>mdi-close</AskAnnaIcon>
        </AskAnnaButton>
      </AskAnnaToolbar>
      <AskAnnaCardText>
        You are about to remove the member <b>{{ peopleName }}</b
        >. Here's what will happen when you remove <b>{{ peopleName }}</b
        >:
        <br />
        <br />
        <ul>
          <li>
            <b>{{ peopleName }}</b> will be removed from this workspace and projects in this workspace
          </li>
          <li>
            <b>{{ peopleName }}</b> will not be able to open this workspace anymore
          </li>
          <li>
            If <b>{{ peopleName }}</b> has access to other workspaces, <b>{{ peopleName }}</b> will still have access to
            these workspaces
          </li>
          <li>
            Everything <b>{{ peopleName }}</b> has done will remain in place
          </li>
        </ul>
        <br />
        The removal action cannot be undone! Please confirm that you want to remove <b>{{ peopleName }}</b
        >:
      </AskAnnaCardText>
      <AskAnnaCardActions :class="{ 'px-3': $vuetify.breakpoint.xsOnly }">
        <AskAnnaButton small outlined text color="secondary" class="mr-1 btn--hover" @click="closeDelete"
          >Cancel</AskAnnaButton
        >
        <AskAnnaButton small outlined text color="error" class="mr-1 btn--hover" @click="deleteItemConfirm"
          >Remove{{ $vuetify.breakpoint.xsOnly ? '' : `: ${name}` }}</AskAnnaButton
        >
      </AskAnnaCardActions>
    </AskAnnaCard>
  </v-dialog>
</template>
<script setup lang="ts">
const props = defineProps({
  value: {
    type: Boolean,
    default: false
  },
  peopleName: {
    type: String,
    default: () => ''
  }
})

const emit = defineEmits(['onCloseDeletePopup', 'onCloseDeletePopup', 'onDeleteConfirm'])

const slicedText = useSlicedText()

const name = computed(() => slicedText(props.peopleName, 17))

const valueModel = computed({
  get: () => props.value,
  set: () => emit('onCloseDeletePopup')
})

const closeDelete = () => emit('onCloseDeletePopup')
const deleteItemConfirm = () => emit('onDeleteConfirm')

const calcHeight = isMobile => {
  let height = 50

  height = isMobile ? 50 + props.peopleName.length / 2 : 50

  return height
}
</script>
<style>
.pre {
  white-space: pre;
}

.mark {
  color: rgba(0, 0, 0, 0.87);
}

.grid-container {
  display: grid;
  grid-template-columns: 0fr auto 0fr;
}

.long {
  max-width: 275px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
