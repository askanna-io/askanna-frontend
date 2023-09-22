<template>
  <div
    class="flex gap-2"
    @dragover.prevent
    @drop.prevent="addFile"
  >
    <div>
      <AskAnnaAvatar
        tile
        class="mb-2"
        rounded="21"
        :size="false ? 150 : 150"
      >
        <VImg
          v-if="imageUrl || workspaceProfile.avatar.large"
          class="img--rounded"
          :src="imageUrl || workspaceProfile.avatar.large"
        />

        <VImg
          v-else
          class="img--rounded"
          src="/assets/icons/askanna-default-gravatar.png"
        />
      </AskAnnaAvatar>
      <div
        v-if="editMode"
        class="flex items-center flex-col"
      >
        <div class="pb-3">
          <AskAnnaButton
            block
            @click="hanleBrowse"
          >
            Change my image
          </AskAnnaButton>
        </div>
        <div>
          <AskAnnaButton
            block
            color="error"
            @click="handleRemove"
          >
            Remove my image
          </AskAnnaButton>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <input
        type="file"
        :value="avatar"
        ref="fileInput"
        class="input-file"
        @input="handleOnInput"
        accept="image/png, image/jpeg, image/bmp"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import defaultAvatar from './avatar'

defineProps({
  editMode: {
    type: Boolean,
    default: true
  },
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
})

const emit = defineEmits(['onChangeAvatar'])

const context = getCurrentInstance()
const imageUrlToBase64 = useImageUrlToBase64()

const fileInput = ref()
const avatar = ref(null)
const imageUrl = ref('')

const hanleBrowse = () => context?.proxy.$refs.fileInput.click()

const handleOnInput = e => {
  imageUrlToBase64.getBase64(e, ({ url, result }) => {
    imageUrl.value = url
    emit('onChangeAvatar', result)
  })
}

const addFile = e => {
  const [file] = e.dataTransfer.files
  handleOnInput(file)
}

const handleRemove = async () => {
  imageUrlToBase64.convertUrlToBase64(defaultAvatar, ({ url, result }) => {
    imageUrl.value = url
    emit('onChangeAvatar', result)
  })
}
</script>
<style lang="scss">
.dropbox {
  outline: 2px dashed grey;
  /* the dash box */
  outline-offset: -10px;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px;
  /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0;
  /* invisible but it's there! */
  position: absolute;
  cursor: pointer;
}
</style>
