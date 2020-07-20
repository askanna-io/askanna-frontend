<template>
  <div v-if="isUploadStart">
    <v-file-input
      class="pr-3"
      :value="resumableFile.file"
      color="deep-purple accent-4"
      label="Replace code by:"
      outlined
      @click:clear="handleDeleteFile"
      :show-size="1000"
    >
      <template v-slot:selection="{ index, text }">
        <v-chip color="primary" dark label small>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>
  </div>
</template>

<script>
import { reactive, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'FilePreview',

  props: {
    isUploadStart: {
      type: Boolean,
      default: false
    },
    resumableFile: {
      type: Object,
      default: function () {
        return {
          name: '',
          size: 0,
          type: ''
        }
      }
    }
  },

  setup(props, context) {
    const handleDeleteFile = () => context.emit('deleteFile', props.resumableFile.uniqueIdentifier)

    return { handleDeleteFile }
  }
})
</script>
<style>
.askanna-alert.v-alert {
  width: 360px;
  font-size: 14px;
}
.askanna-alert.v-alert.v-alert--dense {
  padding-top: 3px;
}
.askanna-alert.v-alert--text:before {
  background-color: initial;
}
</style>
