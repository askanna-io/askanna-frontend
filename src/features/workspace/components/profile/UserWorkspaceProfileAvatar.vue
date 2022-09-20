<template>
  <v-container fluid>
    <v-row dense justify="start" @drop.prevent="addFile" @dragover.prevent>
      <v-col class="pt-0 pb-0" cols="auto" align-self="start">
        <v-avatar class="ma-2" rounded="21" :size="false ? 150 : 150" tile>
          <v-img
            v-if="imageUrl || workspaceProfile.avatar.large"
            class="img--rounded"
            :src="imageUrl || workspaceProfile.avatar.large"
          />

          <v-img v-else class="img--rounded" src="@/assets/icons/ask-annna-default-gravatar.png" />
        </v-avatar>
      </v-col>
      <v-col xs="12" sm="2" lg="2" xl="2">
        <input
          type="file"
          :value="avatar"
          ref="fileInput"
          class="input-file"
          @input="handleOnInput"
          accept="image/png, image/jpeg, image/bmp"
        />
        <v-row no-gutters v-if="editMode">
          <v-col class="pb-3">
            <v-btn x-small block outlined text color="secondary" class="btn--hover" @click="hanleBrowse">
              Change my image
            </v-btn>
          </v-col>
          <v-col>
            <v-btn x-small block outlined text color="secondary" class="btn--hover" @click="handleRemove">
              Remove my image
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
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
