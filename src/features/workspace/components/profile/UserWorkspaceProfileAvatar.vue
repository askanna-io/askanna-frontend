<template>
  <v-row class="dropbox" dense justify="start" @drop.prevent="addFile" @dragover.prevent>
    <v-col class="pt-0 pb-0" cols="12" align-self="start">
      <v-avatar class="ma-2" rounded="21" :size="false ? 150 : 150" tile>
        <v-img
          v-if="imageUrl || workspaceProfile.avatar.large"
          class="img--rounded"
          :src="imageUrl || workspaceProfile.avatar.large"
        />

        <v-img v-else class="img--rounded" src="@/assets/icons/ask-annna-default-gravatar.png" />
      </v-avatar>
    </v-col>
    <v-col cols="1">
      <input
        type="file"
        :value="avatar"
        ref="fileInput"
        class="input-file"
        @input="handleOnInput"
        accept="image/png, image/jpeg, image/bmp"
      />

      <v-btn x-small outlined text color="secondary" class="ma-2 btn--hover" @click="hanleBrowse">
        Change my image
      </v-btn>
      <v-btn x-small outlined text color="secondary" class="ma-2 btn--hover" @click="handleRemove">
        Remove my image
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import useValidationRules from '@/core/composition/useValidationRules'
import { ref, watch, reactive, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'UserWorkspaceProfileAvatar',

  props: {
    workspaceProfile: {
      type: Object,
      default: function () {
        return {
          name: '',
          workspace: {},
          avatar: {
            icon: '',
            large: '',
            medium: '',
            small: ''
          }
        }
      }
    }
  },

  setup(props, context) {
    const fileInput = ref()
    const avatar = ref(null)
    const imageUrl = ref('')

    const hanleBrowse = () => context.refs.fileInput.click()

    const handleOnInput = e => {
      const fileObject = (e?.target && e?.target.files[0]) || e
      const reader = new FileReader()

      reader.onload = () => {
        imageUrl.value = URL.createObjectURL(fileObject)
        context.emit('onChangeAvatar', reader.result)
      }

      reader.readAsDataURL(fileObject)
    }

    const addFile = e => {
      const [file] = e.dataTransfer.files
      handleOnInput(file)
    }

    const handleRemove = () => {
      imageUrl.value = ''
      context.emit('onChangeAvatar', '')
    }

    return {
      avatar,
      addFile,
      imageUrl,
      fileInput,
      hanleBrowse,
      handleRemove,
      handleOnInput
    }
  }
})
</script>
<style lang="scss">
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  position: absolute;
  cursor: pointer;
}
</style>
