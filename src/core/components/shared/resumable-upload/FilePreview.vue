<template>
  <div class="file-preview-wrapper grid-box-item grid-block grid-box-enter-to">
    <div class="file-preview-wrapper-zip file-preview-wrapper-other file-category-archive is-deletable">
      <span class="file-preview other-preview" style="background-color: rgb(186, 131, 34);"
        ><span class="file-preview-overlay"></span><span class="file-ext">{{ fileData.type }}</span
        ><span class="file-size">{{ fileData.size }} KB</span
        ><span class="file-delete"
          ><svg viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            ></path></svg></span
        ><span class="file-name"
          ><span class="file-name-text">{{ fileData.name }}</span></span
        ><span class="file-progress"><span class="file-progress-bar" style="width: 0%;"></span></span
        ><span class="file-icon"
          ><svg viewBox="0 0 100 100">
            <path
              d="M72.4 38.5h-7.9v-7.9l7.9 7.9zm-21.3-7.9v28.8h21.4v-19h-9.9v-9.9H51.1zm3.3-7.6H30.8v5.6h9.3l-5.9 4.5v4.8l8.6-6.6v-2.7h30.1v-2.3L54.4 23zM42.9 35.1l-8.6 6.6v4.8l8.6-6.6v-4.8zm-8.7 20l8.6-6.6v-4.8l-8.6 6.6v4.8zm8.7 2v-4.8l-8.6 6.6v2.6h-3.4v5.6h5.3v3.8H33c-.6-1-1.6-1.6-2.8-1.6-1.8 0-3.2 1.4-3.2 3.2s1.4 3.2 3.2 3.2c1.2 0 2.2-.6 2.8-1.6h3.1V77h4.8v-2.9H44c.6 1 1.6 1.6 2.8 1.6 1.8 0 3.2-1.4 3.2-3.2s-1.4-3.2-3.2-3.2c-1.2 0-2.2.6-2.8 1.6h-3.1v-3.8h13.5l18.5-3.3v-2.3H37.1l5.8-4.4z"
            ></path></svg></span
      ></span>
    </div>
  </div>
</template>

<script>
import { reactive, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'FilePreview',

  props: {
    fileData: {
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
    return {}
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
