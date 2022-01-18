<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="pb-0 pt-0">
      <div class="page">
        <div style="max-height: 420px" class="overflow-y-auto" id="scroll-target">
          <TheHighlight v-if="partFile" :value="partFile" languageName="json" />
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import TheHighlight from '@/core/components/highlight/TheHighlight.vue'
import { reactive, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunPayLoad',

  components: {
    TheHighlight
  },

  props: {
    file: String
  },

  setup(props) {
    const state = reactive({
      sliceStart: 0,
      sliceEnd: 100000
    })

    const partFile = computed(() => {
      return props.file.slice(state.sliceStart, state.sliceEnd)
    })

    return {
      partFile
    }
  }
})
</script>
<style>
.big-json {
  max-height: 300px;
  overflow: hidden;
}

.scroll {
  height: 300px;
  width: 40px;
  overflow-y: scroll;
  display: inline-block;
}

.scroll .inner {
  height: 300%;
  width: 100%;
  content: '.';
}
.scroll.--simple::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.scroll.--simple::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
.scroll.--simple::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}
.scroll.--simple::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}
.scroll.--simple::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.9);
}
</style>
